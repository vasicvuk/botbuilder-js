/**
 * @module adaptive-expressions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { ExpressionType } from './types';
import { FunctionUtils } from '../../functionUtils';
import { InternalFunctionUtils } from '../../functionUtils.internal';
import { ComparisonEvaluator } from '../../builtinFunctions';

/**
 * Return the Boolean version of a value.
 */
export class BoolFunc extends ComparisonEvaluator {
    /**
     * Initializes a new instance of the [Bool](xref:adaptive-expressions.Bool) class.
     */
    public constructor() {
        super(ExpressionType.Bool, BoolFunc.func, FunctionUtils.validateUnary);
    }

    /**
     * @private
     */
    private static func(args: any[]): boolean {
        return InternalFunctionUtils.isLogicTrue(args[0]);
    }
}
