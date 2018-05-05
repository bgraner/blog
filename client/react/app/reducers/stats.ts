import { ReportingStats } from '../helpers/reporting';
import { IAction } from '../actions/actionCreators';
import {
  RECEIVE_ALL_STATS
} from '../actions/actionConstants';

// TODO: Seems like a brittle way to handle changing the state.
// Requires payload to be in exactly the right format
const stats = (state = {
  // Checklist stats
  checklistStats: [],
  completedChecklists: [],
  checklistScoresByDay: {},
  depressionLevelFrequency: {},
  checklistQuestionStats: [],
  checklistScoresByTask: [],
  // Scorecard stats
  scorecardStats: [],
  completedScorecards: [],
  scorecardScoresByDay: {},
  totalScoreOverTime: [],
  taskAbilityStats: {},
  // Task stats
  topTasks: []
} as ReportingStats, action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_ALL_STATS:
      return payload;
    default:
      return state;
  }
};

export default stats;