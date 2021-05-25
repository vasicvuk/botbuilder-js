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
    public static readonly IsDefinite: string = 'isDefinite';
    public static readonly IsTime: string = 'isTime';
    public static readonly IsDuration: string = 'isDuration';
    public static readonly IsDate: string = 'isDate';
    public static readonly IsTimeRange: string = 'isTimeRange';
    public static readonly IsDateRange: string = 'isDateRange';
    public static readonly IsPresent: string = 'isPresent';
    public static readonly GetNextViableDate: string = 'getNextViableDate';
    public static readonly GetPreviousViableDate: string = 'getPreviousViableDate';
    public static readonly GetNextViableTime: string = 'getNextViableTime';
    public static readonly GetPreviousViableTime: string = 'getPreviousViableTime';
    public static readonly TimexResolve: string = 'resolve';
}
