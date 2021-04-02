// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { Url } from 'url';

/**
 * Format a url object into an http host
 *
 * @param url the url to format
 * @returns the formatted http host
 */
export function formatHost(url: Url): string {
    return `${url.protocol}//${url.host}`;
}
