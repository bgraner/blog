import { extend } from 'lodash';
import * as moment from 'moment';

import {
  MappedItems,
  keyifyDate
} from '../helpers/utils';

import {
  IChecklist
} from '../helpers/checklist';

import { IAction } from '../actions/actionCreators';

import {
  RECEIVE_CHECKLISTS,
  RECEIVE_CHECKLIST,
  UPDATE_CHECKLIST
} from '../actions/actionConstants';

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
} as MappedItems<IChecklist>, action = {} as IAction) => {
  const { items, byDate, byId } = state;
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_CHECKLISTS:
      return updateChecklists(state, payload);
    case RECEIVE_CHECKLIST:
    case UPDATE_CHECKLIST:
      return updateWithChecklist(state, payload);
    default:
      return state;
  }
};

export default checklists;