import { extend } from 'lodash';
import * as moment from 'moment';

import { SelectedState } from '../helpers/utils';
import { IAction } from '../actions/actionCreators';
import {
  SELECT_DATE,
  RECEIVE_SCORECARD,
  RECEIVE_CHECKLIST,
  RECEIVE_ENTRY
} from '../actions/actionConstants';


const selected = (state = {} as SelectedState, action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_DATE:
      return extend({}, state, payload);
    case RECEIVE_SCORECARD:
      return extend({}, state, {
        date: moment(payload.date),
        scorecard: extend(state.scorecard || {}, payload)
      });
    case RECEIVE_CHECKLIST:
      return extend({}, state, {
        date: moment(payload.date),
        checklist: extend(state.checklist || {}, payload)
      });
    case RECEIVE_ENTRY:
      return extend({}, state, {
        date: moment(payload.date),
        entry: extend(state.entry || {}, payload)
      });
    default:
      return state;
  }
};

export default selected;