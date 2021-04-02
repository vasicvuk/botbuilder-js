// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import assert from 'assert';
import nock from 'nock'; // eslint-disable-line import/no-extraneous-dependencies
import type { Url } from 'url';
import { formatHost } from './formatHost';

/**
 * Registers mocha hooks for proper usage
 */
export function mocha(): void {
    before(() => nock.disableNetConnect());
    beforeEach(() => nock.cleanAll());
    after(() => nock.enableNetConnect());
    afterEach(() => nock.cleanAll());
}

export type Options = {
    accessToken: string;
    tokenType: string;
};

export type Result = {
    accessToken: string;
    match: (scope: nock.Scope) => nock.Scope;
    verify: (skipped: boolean) => void;
    tokenType: string;
};

/**
 * Stub Oauth flow.
 *
 * @param endpoint oauth endpoint to stub
 * @param options options for stubbing oauth
 * @returns helpers for stubbed oauth
 */
export function stub(endpoint: Url, options: Partial<Options> = {}): Result {
    const { accessToken = 'access_token', tokenType = 'Bearer' } = options;

    const expectation = nock(formatHost(endpoint))
        .post(endpoint.path ?? '/')
        .reply(200, { access_token: accessToken, token_type: tokenType });

    const match = (scope: nock.Scope): nock.Scope => scope.matchHeader('Authorization', `${tokenType} ${accessToken}`);

    return {
        accessToken,
        match,
        verify: (skipped = false) => {
            if (skipped) {
                assert(!expectation.isDone(), 'expected oauth request to be skipped');
            } else {
                expectation.done();
            }
        },
        tokenType,
    };
}
