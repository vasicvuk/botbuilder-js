// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AdaptiveDialogBot, LanguagePolicy } from 'botbuilder-dialogs-adaptive';
import { BotFrameworkAuthentication } from 'botframework-connector';
import { Configuration } from './configuration';
import { Dialog, MemoryScope, PathResolver } from 'botbuilder-dialogs';
import { ResourceExplorer } from 'botbuilder-dialogs-declarative';

import { BotTelemetryClient, ConversationState, SkillConversationIdFactoryBase, UserState } from 'botbuilder-core';

export class ConfigurationAdaptiveDialogBot extends AdaptiveDialogBot {
    constructor(
        configuration: Configuration,
        resourceExplorer: ResourceExplorer,
        conversationState: ConversationState,
        userState: UserState,
        skillConversationIdFactoryBase: SkillConversationIdFactoryBase,
        languagePolicy: LanguagePolicy,
        botFrameworkAuthentication: BotFrameworkAuthentication,
        telemetryClient: BotTelemetryClient,
        memoryScopes: MemoryScope[],
        pathResolvers: PathResolver[],
        dialogs: Dialog[]
    ) {
        const adaptiveDialogId = configuration.string(['defaultRootDialog']);
        if (adaptiveDialogId == null) {
            throw new TypeError('...');
        }

        super(
            adaptiveDialogId,
            configuration.string(['defaultLg']) ?? 'main.lg',
            resourceExplorer,
            conversationState,
            userState,
            skillConversationIdFactoryBase,
            languagePolicy,
            botFrameworkAuthentication,
            telemetryClient,
            memoryScopes,
            pathResolvers,
            dialogs
        );
    }
}
