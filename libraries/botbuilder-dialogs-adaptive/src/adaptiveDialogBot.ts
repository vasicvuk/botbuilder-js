// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import memoize from 'lodash/memoize';
import { BotFrameworkAuthentication, BotFrameworkClient, BotFrameworkClientKey } from 'botframework-connector';
import { Dialog, MemoryScope, PathResolver, runDialog } from 'botbuilder-dialogs';
import { LanguagePolicy } from './languagePolicy';
import { ResourceExplorer } from 'botbuilder-dialogs-declarative';

import {
    ActivityHandlerBase,
    BotCallbackHandlerKey,
    BotTelemetryClient,
    BotTelemetryClientKey,
    ConversationState,
    SkillConversationIdFactoryBase,
    TurnContext,
    UserState,
} from 'botbuilder';
import {
    LanguageGeneratorManager,
    ResourceMultiLanguageGenerator,
    TemplateEngineLanguageGenerator,
} from './generators';
import { skillConversationIdFactoryKey } from './skillExtensions';
import { resourceExplorerKey } from './resourceExtensions';
import { languageGeneratorKey, languageGeneratorManagerKey, languagePolicyKey } from './languageGeneratorExtensions';
import { AdaptiveDialog } from '.';

// TODO not this, figure out if we are standardizing on a particular bot interface instead of activity handler (base?)
export interface Bot {
    onTurn(turnContext: TurnContext): Promise<void>;
}

export class AdaptiveDialogBot extends ActivityHandlerBase implements Bot {
    private static readonly languageGeneratorManagers = new Map<ResourceExplorer, LanguageGeneratorManager>();

    private readonly lazyRootDialog: () => Dialog;

    constructor(
        private readonly adaptiveDialogId: string,
        private readonly languageGeneratorId: string,
        private readonly resourceExplorer: ResourceExplorer,
        private readonly conversationState: ConversationState,
        private readonly userState: UserState,
        private readonly skillConversationIdFactoryBase: SkillConversationIdFactoryBase,
        private readonly languagePolicy: LanguagePolicy,
        private readonly botFrameworkAuthentication: BotFrameworkAuthentication,
        private readonly telemetryClient: BotTelemetryClient,
        private readonly memoryScopes: MemoryScope[] = [],
        private readonly pathResolvers: PathResolver[] = [],
        private readonly dialogs: Dialog[] = []
    ) {
        super();

        this.lazyRootDialog = memoize(() => this.createDialog());
    }

    async onTurn(turnContext: TurnContext): Promise<void> {
        const botFrameworkClient = this.botFrameworkAuthentication.createBotFrameworkClient();

        // Set up the TurnState the Dialog is expecting.
        this.setUpTurnState(turnContext, botFrameworkClient);

        // Load the Dialog from the ResourceExplorer - the actual load should only happen once.
        const rootDialog = await this.lazyRootDialog();

        // Run the dialog.
        await runDialog(
            rootDialog,
            turnContext,
            turnContext.turnState.get<ConversationState>('ConversationState').createProperty('dialogState')
        );

        // Save any updates that have been made.
        await turnContext.turnState.get('ConversationState').saveChanges(turnContext, false);
        await turnContext.turnState.get('UserState').saveChanges(turnContext, false);
    }

    private setUpTurnState(turnContext: TurnContext, botFrameworkClient: BotFrameworkClient): void {
        turnContext.turnState.set(BotFrameworkClientKey, botFrameworkClient);
        turnContext.turnState.set(skillConversationIdFactoryKey, this.skillConversationIdFactoryBase);
        turnContext.turnState.set('ConversationState', this.conversationState);
        turnContext.turnState.set('UserState', this.userState);
        turnContext.turnState.set(resourceExplorerKey, this.resourceExplorer);
        turnContext.turnState.set('memoryScopes', this.memoryScopes);
        turnContext.turnState.set('pathResolvers', this.pathResolvers);

        const languageGenerator = this.resourceExplorer.getResource(this.languageGeneratorId)
            ? new ResourceMultiLanguageGenerator(this.languageGeneratorId)
            : new TemplateEngineLanguageGenerator();
        turnContext.turnState.set(languageGeneratorKey, languageGenerator);

        let manager: LanguageGeneratorManager;
        if (!AdaptiveDialogBot.languageGeneratorManagers.has(this.resourceExplorer)) {
            manager = new LanguageGeneratorManager(this.resourceExplorer);
            AdaptiveDialogBot.languageGeneratorManagers.set(this.resourceExplorer, manager);
        } else {
            manager = AdaptiveDialogBot.languageGeneratorManagers.get(this.resourceExplorer);
        }
        turnContext.turnState.set(languageGeneratorManagerKey, manager);

        turnContext.turnState.set(languagePolicyKey, this.languagePolicy);
        turnContext.turnState.set(BotTelemetryClientKey, this.telemetryClient);
        turnContext.turnState.set(BotCallbackHandlerKey, this.onTurn);
    }

    private createDialog(): Dialog {
        const adaptiveDialogResource = this.resourceExplorer.getResource(this.adaptiveDialogId);
        if (!adaptiveDialogResource) {
            throw new Error(`The ResourceExplorer could not find a resource with id "${this.adaptiveDialogId}"`);
        }

        const adaptiveDialog = this.resourceExplorer.loadType<AdaptiveDialog>(adaptiveDialogResource);

        // If we were passed any Dialogs then add them to the AdaptiveDialog's DialogSet so they can be invoked from any other Dialog.
        this.dialogs.forEach((dialog) => {
            adaptiveDialog.dialogs.add(dialog);
        });

        return adaptiveDialog;
    }
}
