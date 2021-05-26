import { Expression } from '../../expression';
import { IsArray } from './isArray';
import { IsBoolean } from './isBoolean';
import { IsDateTime } from './isDateTime';
import { IsFloat } from './isFloat';
import { IsInteger } from './isInteger';
import { IsObject } from './isObject';
import { IsString } from './isString';
import { ExpressionType } from './types';

export default (): void => {
    Expression.functions.add(ExpressionType.IsObject, new IsObject());
    Expression.functions.add(ExpressionType.IsArray, new IsArray());
    Expression.functions.add(ExpressionType.IsBoolean, new IsBoolean());
    Expression.functions.add(ExpressionType.IsDateTime, new IsDateTime());
    Expression.functions.add(ExpressionType.IsFloat, new IsFloat());
    Expression.functions.add(ExpressionType.IsInteger, new IsInteger());
    Expression.functions.add(ExpressionType.IsString, new IsString());
};
