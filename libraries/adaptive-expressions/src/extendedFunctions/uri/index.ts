import { Expression } from '../../expression';
import { ExpressionType } from './types';
import { UriHost } from './uriHost';
import { UriPath } from './uriPath';
import { UriPathAndQuery } from './uriPathAndQuery';
import { UriPort } from './uriPort';
import { UriQuery } from './uriQuery';
import { UriScheme } from './uriScheme';

export default (): void => {
    Expression.functions.add(ExpressionType.UriHost, new UriHost());
    Expression.functions.add(ExpressionType.UriPath, new UriPath());
    Expression.functions.add(ExpressionType.UriPathAndQuery, new UriPathAndQuery());
    Expression.functions.add(ExpressionType.UriPort, new UriPort());
    Expression.functions.add(ExpressionType.UriQuery, new UriQuery());
    Expression.functions.add(ExpressionType.UriScheme, new UriScheme());
};
