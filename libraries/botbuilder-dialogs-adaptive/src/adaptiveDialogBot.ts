// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import memoize from 'lodash/memoize';
import { BotFrameworkAuthentication } from 'botframework-connector';
import { Dialog, MemoryScope, PathResolver } from 'botbuilder-dialogs';
import { LanguagePolicy } from './languagePolicy';
import { ResourceExplorer } from 'botbuilder-dialogs-declarative';

import {
    ActivityHandlerBase,
    BotTelemetryClient,
    ConversationState,
    SkillConversationIdFactoryBase,
    TurnContext,
    UserState,
} from 'botbuilder-core';

// TODO not this, figure out if we are standardizing on a particular bot interface instead of activity handler (base?)
export interface Bot {
    onTurn(turnContext: TurnContext): Promise<void>;
}

export class AdaptiveDialogBot extends ActivityHandlerBase implements Bot {
    private readonly lazyRootDialog: () => Promise<Dialog>;

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

    async onTurn(turnContext: TurnContext): Promise<void> {}

    private createDialog(): Promise<Dialog> {
        return Promise.resolve({} as Dialog); // TODO
    }
}
