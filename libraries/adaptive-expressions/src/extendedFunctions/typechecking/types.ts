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
    public static readonly IsString: string = 'isString';
    public static readonly IsInteger: string = 'isInteger';
    public static readonly IsArray: string = 'isArray';
    public static readonly IsObject: string = 'isObject';
    public static readonly IsFloat: string = 'isFloat';
    public static readonly IsDateTime: string = 'isDateTime';
    public static readonly IsBoolean: string = 'isBoolean';
}
