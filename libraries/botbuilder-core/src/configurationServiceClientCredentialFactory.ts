// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as t from 'runtypes';
import type { Configuration } from 'botbuilder-dialogs-adaptive-runtime-core';
import { PasswordServiceClientCredentialFactory, ServiceClientCredentialsFactory } from 'botframework-connector';

/**
 * Create a [ServiceClientCredentialsFactory](xref:botframework-connector.ServiceClientCredentialsFactory) instance
 * based on runtime configuration.
 *
 * @param configuration [Configuration](xref:botbuilder-dialogs-adaptive-runtime-core.Configuration) instance
 * @returns [ServiceClientCredentialsFactory](xref:botframework-connector.ServiceClientCredentialsFactory) instance
 */
export function configurationServiceClientCredentialFactory(
    configuration: Configuration
): ServiceClientCredentialsFactory {
    return new PasswordServiceClientCredentialFactory(
        t.Optional(t.String).check(configuration.get(['MicrosoftAppId'])),
        t.Optional(t.String).check(configuration.get(['MicrosoftAppPassword']))
    );
}
