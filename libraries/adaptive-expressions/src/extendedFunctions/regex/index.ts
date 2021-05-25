import { Expression } from '../../expression';
import { IsMatch } from './isMatch';
import { ExpressionType } from './types';

export default (): void => {
    Expression.functions.add(ExpressionType.IsMatch, new IsMatch());
};
