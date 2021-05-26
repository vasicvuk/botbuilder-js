// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AdaptiveDialogBot, LanguagePolicy } from 'botbuilder-dialogs-adaptive';
import { BotFrameworkAuthentication } from 'botframework-connector';
import { Configuration } from './configuration';
import { Dialog, MemoryScope, PathResolver } from 'botbuilder-dialogs';
import { ResourceExplorer } from 'botbuilder-dialogs-declarative';

import { BotTelemetryClient, ConversationState, SkillConversationIdFactoryBase, UserState } from 'botbuilder';
import { TelemetryClient } from 'applicationinsights';
import { ConfigurationConstants } from './configurationConstants';

const defaultLanguageGeneratorId = 'main.lg';

export class ConfigurationAdaptiveDialogBot extends AdaptiveDialogBot {
    constructor(
        configuration: Configuration,
        resourceExplorer: ResourceExplorer,
        conversationState: ConversationState,
        userState: UserState,
        skillConversationIdFactoryBase: SkillConversationIdFactoryBase,
        languagePolicy: LanguagePolicy,
        botFrameworkAuthentication: BotFrameworkAuthentication = BotFrameworkAuthenticationFactory.create(),
        telemetryClient: BotTelemetryClient = new TelemetryClient(),
        memoryScopes: MemoryScope[] = [],
        pathResolvers: PathResolver[] = [],
        dialogs: Dialog[] = []
    ) {
        const adaptiveDialogId = configuration.string([ConfigurationConstants.RootDialogKey]);
        if (adaptiveDialogId == null) {
            throw new TypeError('defaultRootDialog not found in configuration.');
        }

        super(
            adaptiveDialogId,
            configuration.string([ConfigurationConstants.LanguageGeneratorKey]) ?? defaultLanguageGeneratorId,
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
