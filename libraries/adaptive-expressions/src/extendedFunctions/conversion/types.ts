/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Expression types.
 */
export class ExpressionType {
    public static readonly Float: string = 'float';
    public static readonly Int: string = 'int';
    public static readonly String: string = 'string';
    public static readonly Bool: string = 'bool';
    public static readonly Binary: string = 'binary';
    public static readonly Base64: string = 'base64';
    public static readonly Base64ToBinary: string = 'base64ToBinary';
    public static readonly Base64ToString: string = 'base64ToString';
    public static readonly DataUri: string = 'dataUri';
    public static readonly DataUriToBinary: string = 'dataUriToBinary';
    public static readonly DataUriToString: string = 'dataUriToString';
    public static readonly UriComponent: string = 'uriComponent';
    public static readonly UriComponentToString: string = 'uriComponentToString';
    public static readonly FormatNumber: string = 'formatNumber';
    public static readonly JsonStringify: string = 'jsonStringify';
}
