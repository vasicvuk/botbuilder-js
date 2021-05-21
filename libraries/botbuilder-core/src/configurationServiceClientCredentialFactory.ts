// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as t from 'runtypes';
import type { Configuration } from 'botbuilder-dialogs-adaptive-runtime-core';
import { PasswordServiceClientCredentialFactory, ServiceClientCredentialsFactory } from 'botframework-connector';

/**
 * TODO(jpg) this
 *
 * @param configuration configuration
 * @returns service client credentials factory instance
 */
export function configurationServiceClientCredentialFactory(
    configuration: Configuration
): ServiceClientCredentialsFactory {
    const appId = t.Optional(t.String).check(configuration.get(['MicrosoftAppId']));
    const appPassword = t.Optional(t.String).check(configuration.get(['MicrosoftAppPassword']));

    return new PasswordServiceClientCredentialFactory(appId, appPassword);
}
