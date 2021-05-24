// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as t from 'runtypes';
import { Configuration } from 'botbuilder-dialogs-adaptive-runtime-core';
import { configurationServiceClientCredentialFactory } from './configurationServiceClientCredentialFactory';

import {
    AuthenticationConfiguration,
    BotFrameworkAuthentication,
    BotFrameworkAuthenticationFactory,
} from 'botframework-connector';

/**
 * Create a [BotFrameworkAuthentication](xref:botframework-connector.BotFrameworkAuthentication) instance
 * based on runtime configuration.
 *
 * @param configuration [Configuration](xref:botbuilder-dialogs-adaptive-runtime-core.Configuration) instance
 * @param authenticationConfiguration [AuthenticationConfiguration](xref:botframework-connector.AuthenticationConfiguration) instance
 * @returns [BotFrameworkAuthentication](xref:botframework-connector.BotFrameworkAuthentication) instance
 */
export function configurationBotFrameworkAuthentication(
    configuration: Configuration,
    authenticationConfiguration = new AuthenticationConfiguration()
): BotFrameworkAuthentication {
    const {
        ChannelService,
        ValidateAuthority: MaybeValidateAuthority = 'true',
        ToChannelFromBotLoginUrl,
        ToChannelFromBotOAuthScope,
        ToBotFromChannelTokenIssuer,
        OAuthUrl,
        ToBotFromChannelOpenIdMetadataUrl,
        ToBotFromEmulatorOpenIdMetadataUrl,
        CallerId,
    } = t
        .Record({
            ChannelService: t.String,
            ValidateAuthority: t.Union(t.String, t.Boolean),
            ToChannelFromBotLoginUrl: t.String,
            ToChannelFromBotOAuthScope: t.String,
            ToBotFromChannelTokenIssuer: t.String,
            OAuthUrl: t.String,
            ToBotFromChannelOpenIdMetadataUrl: t.String,
            ToBotFromEmulatorOpenIdMetadataUrl: t.String,
            CallerId: t.String,
        })
        .asPartial()
        .check(configuration.get([]));

    let ValidateAuthority = true;
    try {
        ValidateAuthority = t.Boolean.check(JSON.parse(MaybeValidateAuthority.toString()));
    } catch (_err) {
        // no-op
    }

    return BotFrameworkAuthenticationFactory.create(
        ChannelService,
        ValidateAuthority,
        ToChannelFromBotLoginUrl,
        ToChannelFromBotOAuthScope,
        ToBotFromChannelTokenIssuer,
        OAuthUrl,
        ToBotFromChannelOpenIdMetadataUrl,
        ToBotFromEmulatorOpenIdMetadataUrl,
        CallerId,
        configurationServiceClientCredentialFactory(configuration),
        authenticationConfiguration
    );
}
