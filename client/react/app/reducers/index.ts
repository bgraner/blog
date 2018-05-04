import { Dispatch, combineReducers } from 'redux';
import * as moment from 'moment';
import { extend, merge } from 'lodash';

import {
  IScorecard
} from '../helpers/scorecard';

import {
  IChecklist,
  IQuestion
} from '../helpers/checklist';

import { IUser } from '../helpers/auth';

import {
  IChallenge,
  fetchActiveChallenges,
  fetchMyChallenges,
  fetchByDate as fetchChallengesByDate,
  toggleChallengeByDate
} from '../helpers/challenges';

import friends from './friends';

import * as actions from '../actions/actionCreators';
import * as ac from '../actions/actionConstants';

import {
  Entry
} from '../helpers/entries';

import { ReportingStats } from '../helpers/reporting';

import {
  SelectedState,
  ChallengeState,
  MappedItems,
  mapByDate,
  mapById,
  keyifyDate
} from '../helpers/utils';

// Reducers

const currentUser = (state = null as IUser, action = {} as actions.IAction) => {
  switch (action.type) {
    case ac.RECEIVE_CURRENT_USER:
      return action.payload;
    default:
      return state;
  }
};

const currentView = (state = ac.LIST_VIEW, action = {} as actions.ViewAction) => {
  switch (action.type) {
    case ac.UPDATE_VIEW:
      return action.view;
    default:
      return state;
  }
};

const selected = (state = {} as SelectedState, action = {} as actions.IAction) => {
  const { type, payload } = action;

  switch (type) {
    case ac.SELECT_DATE:
      return extend({}, state, payload);
    case ac.RECEIVE_SCORECARD:
      return extend({}, state, {
        date: moment(payload.date),
        scorecard: extend(state.scorecard || {}, payload)
      });
    case ac.RECEIVE_CHECKLIST:
      return extend({}, state, {
        date: moment(payload.date),
        checklist: extend(state.checklist || {}, payload)
      });
    case ac.RECEIVE_ENTRY:
      return extend({}, state, {
        date: moment(payload.date),
        entry: extend(state.entry || {}, payload)
      });
    default:
      return state;
  }
};

const updateWithScorecard = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IScorecard>, scorecard: IScorecard) => {
  const { byId, byDate, items } = state;
  const { id: scorecardId, date } = scorecard;
  const existing = byId[scorecardId];
  const updated = extend({}, existing, scorecard);

  return {
    items: existing ? items : items.concat(scorecardId),
    byDate: extend({}, byDate, {
      [keyifyDate(date)]: updated
    }),
    byId: extend({}, byId, {
      [scorecardId]: updated
    })
  };
};

const updateScorecards = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IScorecard>, scorecards: IScorecard[]) => {
  const { byId, byDate, items } = state;

  return scorecards.reduce((nextState, scorecard) => {
    return updateWithScorecard(nextState, scorecard);
  }, { items, byId, byDate });
};

const scorecards = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IScorecard>, action = {} as actions.IAction) => {
  const { type, payload } = action;

  switch (type) {
    case ac.RECEIVE_SCORECARDS:
      return updateScorecards(state, payload);
    case ac.RECEIVE_SCORECARD:
    case ac.UPDATE_SCORECARD:
      return updateWithScorecard(state, payload);
    default:
      return state;
  }
};

const updateWithChecklist = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IChecklist>, checklist: IChecklist) => {
  const { byId, byDate, items } = state;
  const { id: checklistId, date } = checklist;
  const existing = byId[checklistId];
  const updated = extend({}, existing, checklist);

  return {
    items: existing ? items : items.concat(checklistId),
    byDate: extend({}, byDate, {
      [keyifyDate(date)]: updated
    }),
    byId: extend({}, byId, {
      [checklistId]: updated
    })
  };
};

const updateChecklists = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IChecklist>, checklists: IChecklist[]) => {
  const { byId, byDate, items } = state;

  return checklists.reduce((nextState, checklist) => {
    return updateWithChecklist(nextState, checklist);
  }, { items, byId, byDate });
};

const checklists = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IChecklist>, action = {} as actions.IAction) => {
  const { items, byDate, byId } = state;
  const { type, payload } = action;

  switch (type) {
    case ac.RECEIVE_CHECKLISTS:
      return updateChecklists(state, payload);
    case ac.RECEIVE_CHECKLIST:
    case ac.UPDATE_CHECKLIST:
      return updateWithChecklist(state, payload);
    default:
      return state;
  }
};

const questions = (state = [] as IQuestion[], action = {} as actions.IAction) => {
  const { type, payload } = action;

  switch (type) {
    case ac.RECEIVE_CHECKLIST:
      return payload.questions.map((question: IQuestion) => {
        const { id, text, category } = question;

        return { id, text, category };
      });
    default:
      return state;
  }
};

// TODO: clean/DRY up
const updateWithEntry = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<Entry>, entry: Entry) => {
  const { byId, byDate, items } = state;
  const { id: entryId, date } = entry;
  const existing = byId[entryId];
  const updated = extend({}, existing, entry);

  return {
    items: existing ? items : items.concat(entryId),
    byDate: extend({}, byDate, {
      [keyifyDate(date)]: updated
    }),
    byId: extend({}, byId, {
      [entryId]: updated
    })
  };
};

const updateEntries = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<Entry>, entries: Entry[]) => {
  const { byId, byDate, items } = state;

  return entries.reduce((nextState, entry) => {
    return updateWithEntry(nextState, entry);
  }, { items, byId, byDate });
};

const entries = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<Entry>, action = {} as actions.IAction) => {
  const { items, byDate, byId } = state;
  const { type, payload } = action;

  switch (type) {
    case ac.RECEIVE_ENTRIES:
      return updateEntries(state, payload);
    case ac.RECEIVE_ENTRY:
      return updateWithEntry(state, payload);
    default:
      return state;
  }
};

const updateWithChallenge = (
  state: ChallengeState,
  payload: { date: string, challenge: IChallenge },
) => {
  const { byDate } = state;
  const { date, challenge } = payload;
  const key = keyifyDate(date);
  const existing = byDate[key];

  return {
    ...state,
    byDate: {
      [key]: existing.map(original => {
        return (original.id === challenge.id) ? challenge : original;
      })
    }
  };
};

const challenges = (state = {
  all: [],
  mine: [],
  byDate: {}
} as ChallengeState, action = {} as actions.IAction) => {
  const { mine = [], byDate = {} } = state;
  const { type, payload } = action;

  switch (type) {
    case ac.RECEIVE_CHALLENGES:
      return {
        ...state,
        byDate: {
          ...byDate,
          [keyifyDate(payload.date)]: payload.challenges
        }
      };
    case ac.RECEIVE_ALL_CHALLENGES:
      return { ...state, all: payload };
    case ac.RECEIVE_MY_CHALLENGES:
      return { ...state, mine: payload };
    case ac.UPDATE_CHALLENGE:
      // TODO: make this better
      return updateWithChallenge(state, payload);
    default:
      return state;
  }
};

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
} as ReportingStats, action = {} as actions.IAction) => {
  const { type, payload } = action;

  switch (type) {
    case ac.RECEIVE_ALL_STATS:
      return payload;
    default:
      return state;
  }
};

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
