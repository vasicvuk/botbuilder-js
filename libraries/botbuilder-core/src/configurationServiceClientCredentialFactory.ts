// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as t from 'runtypes';
import type { Configuration } from 'botbuilder-dialogs-adaptive-runtime-core';
import { PasswordServiceClientCredentialFactory } from 'botframework-connector';

/**
 * Create a [ServiceClientCredentialsFactory](xref:botframework-connector.ServiceClientCredentialsFactory) instance
 * based on runtime configuration.
 */
export class ConfigurationServiceClientCredentialFactory extends PasswordServiceClientCredentialFactory {
    /**
     * Construct a [ConfigurationServiceClientCredentialFactory](xref:botbuilder-core.ConfigurationServiceClientCredentialFactory)
     *
     * @param configuration [Configuration](xref:botbuilder-dialogs-adaptive-runtime-core.Configuration) instance
     */
    constructor(configuration: Configuration) {
        super(
            t.Optional(t.String).check(configuration.get(['MicrosoftAppId'])),
            t.Optional(t.String).check(configuration.get(['MicrosoftAppPassword']))
        );
    }
}
