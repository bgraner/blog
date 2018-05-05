import { combineReducers } from 'redux';

/**
 * State structure:
 * {
 *  currentUser: {},
 *  currentView: Chart|List,
 *  checklists: {
 *    items: [],
 *    byDate: {},
 *    byId: {}
 *  },
 *  scorecards: {
 *    items: [],
 *    byDate: {},
 *    byId: {}
 *  },
 *  entries: {
 *    items: [],
 *    byDate: {},
 *    byId: {}
 *  },
 *  selected: {
 *    scorecard: Id?,
 *    checklist: Id?,
 *    date: Date
 *  },
 *  stats: {
 *    ...
 *  },
 *  friends: {
 *   invited: [],
 *   invitations: [],
 *   active: [],
 *   disabled: []
 *  }
 * }
 */

import currentUser from './currentUser';
import currentView from './currentView';
import selected from './selected';
import scorecards from './scorecards';
import checklists from './checklists';
import questions from './questions';
import entries from './entries';
import challenges from './challenges';
import stats from './stats';
import friends from './friends';

const rootReducer = combineReducers({
  currentUser,
  currentView,
  selected,
  scorecards,
  checklists,
  entries,
  questions,
  challenges,
  stats,
  friends
});

export default rootReducer;
