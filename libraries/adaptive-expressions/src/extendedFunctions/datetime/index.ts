import { Expression } from '../../expression';
import { AddDays } from './addDays';
import { ExpressionType } from './types';

export default (): void => {
    Expression.functions.add(ExpressionType.AddDays, new AddDays());
};
