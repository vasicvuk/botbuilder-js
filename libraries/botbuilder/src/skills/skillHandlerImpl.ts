// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BotFrameworkAdapter } from '../botFrameworkAdapter';
import { BotLogic } from '../interfaces';
import { ClaimsIdentity, JwtTokenValidation } from 'botframework-connector';
import { v4 as uuid } from 'uuid';

import {
    Activity,
    ActivityTypes,
    BotAdapter,
    CallerIdConstants,
    ResourceResponse,
    SkillConversationIdFactoryBase,
    SkillConversationReference,
    TurnContext,
} from 'botbuilder-core';

/**
 * @internal
 */
export class SkillHandlerImpl {
    constructor(
        private readonly skillConversationReferenceKey: symbol,
        private readonly adapter: BotAdapter,
        private readonly logic: BotLogic,
        private readonly conversationIdFactory: SkillConversationIdFactoryBase,
        private readonly getOauthScope: () => string | undefined = () => undefined
    ) {}

    onSendToConversation(
        claimsIdentity: ClaimsIdentity,
        conversationId: string,
        activity: Activity
    ): Promise<ResourceResponse> {
        return this.processActivity(claimsIdentity, conversationId, null, activity);
    }

    onReplyToActivity(
        claimsIdentity: ClaimsIdentity,
        conversationId: string,
        activityId: string,
        activity: Activity
    ): Promise<ResourceResponse> {
        return this.processActivity(claimsIdentity, conversationId, activityId, activity);
    }

    async onUpdateActivity(
        claimsIdentity: ClaimsIdentity,
        conversationId: string,
        activityId: string,
        activity: Activity
    ): Promise<ResourceResponse> {
        let resourceResponse: ResourceResponse | void;

        await this.continueConversation(claimsIdentity, conversationId, async (context, ref) => {
            const newActivity = TurnContext.applyConversationReference(activity, ref.conversationReference);

            context.activity.id = activityId;
            context.activity.callerId = `${CallerIdConstants.BotToBotPrefix}${JwtTokenValidation.getAppIdFromClaims(
                claimsIdentity.claims
            )}`;

            resourceResponse = await context.updateActivity(newActivity);
        });

        return resourceResponse ? resourceResponse : { id: activityId };
    }

    async onDeleteActivity(claimsIdentity: ClaimsIdentity, conversationId: string, activityId: string): Promise<void> {
        return this.continueConversation(claimsIdentity, conversationId, (context) =>
            context.deleteActivity(activityId)
        );
    }

    private async getSkillConversationReference(conversationId: string): Promise<SkillConversationReference> {
        let skillConversationReference: SkillConversationReference;

        try {
            skillConversationReference = await this.conversationIdFactory.getSkillConversationReference(conversationId);
        } catch (err) {
            // If the factory has overridden getSkillConversationReference, call the deprecated getConversationReference().
            // In this scenario, the oAuthScope paired with the ConversationReference can only be used for talking with
            // an official channel, not another bot.
            if (err.message === 'Not Implemented') {
                skillConversationReference = {
                    conversationReference: await this.conversationIdFactory.getConversationReference(conversationId),
                    oAuthScope: this.getOauthScope(),
                };
            } else {
                throw err;
            }
        }

        if (!skillConversationReference) {
            throw new Error('skillConversationReference not found');
        } else if (!skillConversationReference.conversationReference) {
            throw new Error('conversationReference not found.');
        }

        return skillConversationReference;
    }

    private async processActivity(
        claimsIdentity: ClaimsIdentity,
        conversationId: string,
        activityId: string,
        activity: Activity
    ): Promise<ResourceResponse> {
        let resourceResponse: ResourceResponse;

        await this.continueConversation(claimsIdentity, conversationId, async (context, ref) => {
            /**
             * This callback does the following:
             *  - Applies the correct ConversationReference to the Activity for sending to the user-router conversation.
             *  - For EndOfConversation Activities received from the Skill, removes the ConversationReference from the
             *    ConversationIdFactory
             */

            const newActivity = TurnContext.applyConversationReference(activity, ref.conversationReference);

            context.activity.id = activityId;
            context.activity.callerId = `${CallerIdConstants.BotToBotPrefix}${JwtTokenValidation.getAppIdFromClaims(
                claimsIdentity.claims
            )}`;

            if (this.adapter instanceof BotFrameworkAdapter) {
                const client = this.adapter.createConnectorClient(newActivity.serviceUrl);
                context.turnState.set(this.adapter.ConnectorClientKey, client);
            }

            switch (newActivity.type) {
                case ActivityTypes.EndOfConversation:
                    await this.conversationIdFactory.deleteConversationReference(conversationId);

                    this.applyEoCToTurnContextActivity(context, newActivity);
                    await this.logic(context);

                    break;

                case ActivityTypes.Event:
                    this.applyEventToTurnContextActivity(context, newActivity);
                    await this.logic(context);

                    break;

                default:
                    resourceResponse = await context.sendActivity(newActivity);
                    break;
            }
        });

        if (!resourceResponse) {
            resourceResponse = { id: uuid() };
        }

        return resourceResponse;
    }

    private async continueConversation(
        claimsIdentity: ClaimsIdentity,
        conversationId: string,
        callback: (context: TurnContext, ref: SkillConversationReference) => Promise<void>
    ): Promise<void> {
        const ref = await this.getSkillConversationReference(conversationId);

        const continueCallback = (context: TurnContext): Promise<void> => {
            context.turnState.set(this.skillConversationReferenceKey, ref);
            return callback(context, ref);
        };

        try {
            await this.adapter.continueConversationWithClaims(
                claimsIdentity,
                ref.conversationReference,
                ref.oAuthScope,
                continueCallback
            );
        } catch (err) {
            if (err.message === 'Not Implemented') {
                // We're in the legacy scenario where our adapter does not support passing through claims/audience
                // explicitly. Stash it in turn context and hope for the best!
                await this.adapter.continueConversation(ref.conversationReference, async (context) => {
                    context.turnState.set(context.adapter.BotIdentityKey, claimsIdentity);
                    return continueCallback(context);
                });
            }

            throw err;
        }
    }

    // transform the turnContext.activity to be an EndOfConversation Activity.
    private applyEoCToTurnContextActivity(
        turnContext: TurnContext,
        endOfConversationActivity: Partial<Activity>
    ): void {
        turnContext.activity.type = endOfConversationActivity.type;
        turnContext.activity.text = endOfConversationActivity.text;
        turnContext.activity.code = endOfConversationActivity.code;

        turnContext.activity.replyToId = endOfConversationActivity.replyToId;
        turnContext.activity.value = endOfConversationActivity.value;
        turnContext.activity.entities = endOfConversationActivity.entities;
        turnContext.activity.locale = endOfConversationActivity.locale;
        turnContext.activity.localTimestamp = endOfConversationActivity.localTimestamp;
        turnContext.activity.timestamp = endOfConversationActivity.timestamp;
        turnContext.activity.channelData = endOfConversationActivity.channelData;
    }

    // transform the turnContext.activity to be an Event Activity.
    private applyEventToTurnContextActivity(turnContext: TurnContext, eventActivity: Partial<Activity>): void {
        turnContext.activity.type = eventActivity.type;
        turnContext.activity.name = eventActivity.name;
        turnContext.activity.value = eventActivity.value;
        turnContext.activity.relatesTo = eventActivity.relatesTo;

        turnContext.activity.replyToId = eventActivity.replyToId;
        turnContext.activity.value = eventActivity.value;
        turnContext.activity.entities = eventActivity.entities;
        turnContext.activity.locale = eventActivity.locale;
        turnContext.activity.localTimestamp = eventActivity.localTimestamp;
        turnContext.activity.timestamp = eventActivity.timestamp;
        turnContext.activity.channelData = eventActivity.channelData;
    }
}
