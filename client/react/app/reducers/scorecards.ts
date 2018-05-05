import { extend } from 'lodash';
import * as moment from 'moment';

import {
  MappedItems,
  keyifyDate
} from '../helpers/utils';

import {
  IScorecard
} from '../helpers/scorecard';

import { IAction } from '../actions/actionCreators';
import {
  RECEIVE_SCORECARDS,
  UPDATE_SCORECARD,
  RECEIVE_SCORECARD
} from '../actions/actionConstants';

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
} as MappedItems<IScorecard>, action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_SCORECARDS:
      return updateScorecards(state, payload);
    case RECEIVE_SCORECARD:
    case UPDATE_SCORECARD:
      return updateWithScorecard(state, payload);
    default:
      return state;
  }
};

export default scorecards;