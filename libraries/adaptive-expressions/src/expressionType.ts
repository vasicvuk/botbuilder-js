/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Built-in expression types.
 */
export class ExpressionType {
    // Math
    public static readonly Add: string = '+';
    public static readonly Subtract: string = '-';
    public static readonly Multiply: string = '*';
    public static readonly Divide: string = '/';
    public static readonly Min: string = 'min';
    public static readonly Max: string = 'max';
    public static readonly Power: string = '^';
    public static readonly Mod: string = '%';
    public static readonly Average: string = 'average';
    public static readonly Sum: string = 'sum';
    public static readonly Count: string = 'count';
    public static readonly Range: string = 'range';
    public static readonly Floor: string = 'floor';
    public static readonly Ceiling: string = 'ceiling';
    public static readonly Round: string = 'round';
    public static readonly Abs: string = 'abs';
    public static readonly Sqrt: string = 'sqrt';
    public static readonly Rand: string = 'rand';

    // Comparisons
    public static readonly LessThan: string = '<';
    public static readonly LessThanOrEqual: string = '<=';
    public static readonly Equal: string = '==';
    public static readonly NotEqual: string = '!=';
    public static readonly GreaterThan: string = '>';
    public static readonly GreaterThanOrEqual: string = '>=';
    public static readonly Exists: string = 'exists';
    public static readonly Contains: string = 'contains';
    public static readonly Empty: string = 'empty';

    // Logic
    public static readonly And: string = '&&';
    public static readonly Or: string = '||';
    public static readonly Not: string = '!';

    // String
    public static readonly Concat: string = 'concat';
    public static readonly Length: string = 'length';
    public static readonly Replace: string = 'replace';
    public static readonly ReplaceIgnoreCase: string = 'replaceIgnoreCase';
    public static readonly Split: string = 'split';
    public static readonly Substring: string = 'substring';
    public static readonly ToLower: string = 'toLower';
    public static readonly ToUpper: string = 'toUpper';
    public static readonly Trim: string = 'trim';
    public static readonly Join: string = 'join';
    public static readonly EndsWith: string = 'endsWith';
    public static readonly StartsWith: string = 'startsWith';
    public static readonly CountWord: string = 'countWord';
    public static readonly AddOrdinal: string = 'addOrdinal';
    public static readonly NewGuid: string = 'newGuid';
    public static readonly IndexOf: string = 'indexOf';
    public static readonly LastIndexOf: string = 'lastIndexOf';
    public static readonly EOL: string = 'EOL';
    public static readonly SentenceCase: string = 'sentenceCase';
    public static readonly TitleCase: string = 'titleCase';

    // Memory
    public static readonly Accessor: string = 'Accessor';
    public static readonly Element: string = 'Element';
    public static readonly SetPathToValue: string = 'setPathToValue';
    public static readonly Coalesce: string = 'coalesce';

    // Collection
    public static readonly CreateArray: string = 'createArray';
    public static readonly First: string = 'first';
    public static readonly Last: string = 'last';
    public static readonly Foreach: string = 'foreach';
    public static readonly Select: string = 'select';
    public static readonly Where: string = 'where';
    public static readonly Union: string = 'union';
    public static readonly Intersection: string = 'intersection';
    public static readonly Skip: string = 'skip';
    public static readonly Take: string = 'take';
    public static readonly FilterNotEqual: string = 'filterNotEqual';
    public static readonly SubArray: string = 'subArray';
    public static readonly SortBy: string = 'sortBy';
    public static readonly SortByDescending: string = 'sortByDescending';
    public static readonly IndicesAndValues: string = 'indicesAndValues';
    public static readonly Flatten: string = 'flatten';
    public static readonly Unique: string = 'unique';
    public static readonly Reverse: string = 'reverse';
    public static readonly Any: string = 'any';
    public static readonly All: string = 'all';

    // Misc
    public static readonly Constant: string = 'Constant';
    public static readonly Lambda: string = 'Lambda';
    public static readonly If: string = 'if';

    // Object manipulation and construction functions
    public static readonly Json: string = 'json';
    public static readonly AddProperty: string = 'addProperty';
    public static readonly RemoveProperty: string = 'removeProperty';
    public static readonly SetProperty: string = 'setProperty';
    public static readonly GetProperty: string = 'getProperty';
    public static readonly JPath: string = 'jPath';
    public static readonly Merge: string = 'merge';

    // StringOrValue
    public static readonly StringOrValue: string = 'stringOrValue';

    public static readonly Ignore: string = 'ignore';
    public static readonly Optional: string = 'optional';
}
