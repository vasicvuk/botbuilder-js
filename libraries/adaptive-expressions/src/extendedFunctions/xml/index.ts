import { Expression } from '../../expression';
import { ExpressionType } from './types';
import { XML } from './xml';
import { XPath } from './xpath';

export default (): void => {
    Expression.functions.add(ExpressionType.XML, new XML());
    Expression.functions.add(ExpressionType.XPath, new XPath());
};
