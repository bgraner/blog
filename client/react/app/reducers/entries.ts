import { extend } from 'lodash';
import * as moment from 'moment';

import {
  MappedItems,
  keyifyDate
} from '../helpers/utils';

import {
  Entry
} from '../helpers/entries';

import { IAction } from '../actions/actionCreators';

import {
  RECEIVE_ENTRIES,
  RECEIVE_ENTRY
} from '../actions/actionConstants';

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
} as MappedItems<Entry>, action = {} as IAction) => {
  const { items, byDate, byId } = state;
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_ENTRIES:
      return updateEntries(state, payload);
    case RECEIVE_ENTRY:
      return updateWithEntry(state, payload);
    default:
      return state;
  }
};

export default entries;