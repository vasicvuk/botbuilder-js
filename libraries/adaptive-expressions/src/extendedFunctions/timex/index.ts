import { Expression } from '../../expression';
import { GetNextViableDate } from './getNextViableDate';
import { GetNextViableTime } from './getNextViableTime';
import { GetPreviousViableDate } from './getPreviousViableDate';
import { GetPreviousViableTime } from './getPreviousViableTime';
import { IsDate } from './isDate';
import { IsDateRange } from './isDateRange';
import { IsDefinite } from './isDefinite';
import { IsDuration } from './isDuration';
import { IsPresent } from './isPresent';
import { IsTime } from './isTime';
import { IsTimeRange } from './isTimeRange';
import { TimexResolve } from './timexResolve';
import { ExpressionType } from './types';

export default (): void => {
    Expression.functions.add(ExpressionType.GetNextViableDate, new GetNextViableDate());
    Expression.functions.add(ExpressionType.GetNextViableTime, new GetNextViableTime());
    Expression.functions.add(ExpressionType.GetPreviousViableDate, new GetPreviousViableDate());
    Expression.functions.add(ExpressionType.GetPreviousViableTime, new GetPreviousViableTime());
    Expression.functions.add(ExpressionType.IsDate, new IsDate());
    Expression.functions.add(ExpressionType.IsDateRange, new IsDateRange());
    Expression.functions.add(ExpressionType.IsTime, new IsTime());
    Expression.functions.add(ExpressionType.IsTimeRange, new IsTimeRange());
    Expression.functions.add(ExpressionType.IsPresent, new IsPresent());
    Expression.functions.add(ExpressionType.IsDuration, new IsDuration());
    Expression.functions.add(ExpressionType.IsDefinite, new IsDefinite());
    Expression.functions.add(ExpressionType.TimexResolve, new TimexResolve());
};
