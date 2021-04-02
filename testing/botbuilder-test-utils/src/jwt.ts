// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import assert from 'assert';
import forge from 'node-forge';
import jwt from 'jsonwebtoken'; // eslint-disable-line import/no-extraneous-dependencies
import nock from 'nock'; // eslint-disable-line import/no-extraneous-dependencies
import type { Url } from 'url';
import { formatHost } from './formatHost';
import { nanoid } from 'nanoid';

/**
 * Registers mocha hooks for proper usage
 */
export function mocha(): void {
    before(() => nock.disableNetConnect());
    beforeEach(() => nock.cleanAll());
    after(() => nock.enableNetConnect());
    afterEach(() => nock.cleanAll());
}

export type Endpoints = {
    jwks: Url;
    oauth: Url;
    openId: Url;
};

export type Options = {
    algorithm: string;
    bits: number;
    expiresIn: number;
    issuer: string;
    keyid: string;
};

export type Result = {
    algorithm: string;
    issuer: string;
    keyid: string;
    sign: (payload: Record<string, string>) => string;
    verify: () => void;
};

// encodes a forge big int as a base64 string
const encodeBigInt = (bigInt: forge.jsbn.BigInteger): string =>
    // Note: the @types declarations for forge are wrong, `toString` does take a base.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forge.util.encode64(forge.util.hexToBytes((bigInt as any).toString(16)));

/**
 * This allows callers to stub Open ID/JWKS key fetching. In effect, this allows callers
 * to create signed JWTs in the tests that can be verified by code that fetches signing
 * keys via Open ID/JWKS spec.
 *
 * @param endpoints endpoints to stub
 * @param options options for stubbing jwt
 * @returns helpers for stubbed jwt
 */
export function stub(endpoints: Endpoints, options: Partial<Options> = {}): Result {
    const { algorithm = 'RS256', bits = 2048, expiresIn = 1000 * 60 * 5, issuer = 'iss', keyid = nanoid() } = options;

    const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(bits);

    const sign = (payload: Record<string, string>): string =>
        jwt.sign(payload, forge.pki.privateKeyToPem(privateKey), {
            algorithm,
            expiresIn,
            issuer,
            keyid,
        });

    const openIdExpectation = nock(formatHost(endpoints.openId))
        .get(endpoints.openId.path ?? '/')
        .reply(200, {
            authorization_endpoint: 'unused',
            end_session_endpoint: 'unused',
            issuer,
            jwks_uri: `${formatHost(endpoints.jwks)}${endpoints.jwks.path ?? '/'}`,
            token_endpoint: `${formatHost(endpoints.oauth)}${endpoints.oauth.path ?? '/'}`,
        })
        .persist();

    const jwksExpectation = nock(formatHost(endpoints.jwks))
        .get(endpoints.jwks.path ?? '/')
        .reply(200, {
            keys: [
                {
                    kty: 'RSA',
                    use: 'sig',
                    kid: keyid,
                    n: encodeBigInt(publicKey.n),
                    e: encodeBigInt(publicKey.e),
                    alg: algorithm,
                },
            ],
        });

    return {
        algorithm,
        issuer,
        keyid,
        sign,
        verify: (skipped = false) => {
            if (skipped) {
                assert.ok(!openIdExpectation.isDone(), 'expected open ID request to be skipped');
                assert.ok(!jwksExpectation.isDone(), 'expected jwks request to be skipped');
            } else {
                openIdExpectation.done();
                jwksExpectation.done();
            }
        },
    };
}
