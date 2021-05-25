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
    public static readonly AddDays: string = 'addDays';
    public static readonly AddHours: string = 'addHours';
    public static readonly AddMinutes: string = 'addMinutes';
    public static readonly AddSeconds: string = 'addSeconds';
    public static readonly DayOfMonth: string = 'dayOfMonth';
    public static readonly DayOfWeek: string = 'dayOfWeek';
    public static readonly DayOfYear: string = 'dayOfYear';
    public static readonly Month: string = 'month';
    public static readonly Date: string = 'date';
    public static readonly Year: string = 'year';
    public static readonly UtcNow: string = 'utcNow';
    public static readonly FormatDateTime: string = 'formatDateTime';
    public static readonly FormatEpoch: string = 'formatEpoch';
    public static readonly FormatTicks: string = 'formatTicks';
    public static readonly SubtractFromTime: string = 'subtractFromTime';
    public static readonly DateReadBack: string = 'dateReadBack';
    public static readonly GetTimeOfDay: string = 'getTimeOfDay';
    public static readonly GetFutureTime: string = 'getFutureTime';
    public static readonly GetPastTime: string = 'getPastTime';
    public static readonly ConvertFromUTC: string = 'convertFromUTC';
    public static readonly ConvertToUTC: string = 'convertToUTC';
    public static readonly AddToTime: string = 'addToTime';
    public static readonly StartOfDay: string = 'startOfDay';
    public static readonly StartOfHour: string = 'startOfHour';
    public static readonly StartOfMonth: string = 'startOfMonth';
    public static readonly Ticks: string = 'ticks';
    public static readonly TicksToDays: string = 'ticksToDays';
    public static readonly TicksToHours: string = 'ticksToHours';
    public static readonly TicksToMinutes: string = 'ticksToMinutes';
    public static readonly DateTimeDiff: string = 'dateTimeDiff';
}
