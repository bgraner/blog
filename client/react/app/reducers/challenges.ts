import {
  ChallengeState,
  keyifyDate
} from '../helpers/utils';

import {
  IChallenge
} from '../helpers/challenges';

import { IAction } from '../actions/actionCreators';

import {
  RECEIVE_CHALLENGES,
  RECEIVE_ALL_CHALLENGES,
  RECEIVE_MY_CHALLENGES,
  UPDATE_CHALLENGE
} from '../actions/actionConstants';

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
} as ChallengeState, action = {} as IAction) => {
  const { mine = [], byDate = {} } = state;
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_CHALLENGES:
      return {
        ...state,
        byDate: {
          ...byDate,
          [keyifyDate(payload.date)]: payload.challenges
        }
      };
    case RECEIVE_ALL_CHALLENGES:
      return { ...state, all: payload };
    case RECEIVE_MY_CHALLENGES:
      return { ...state, mine: payload };
    case UPDATE_CHALLENGE:
      // TODO: make this better
      return updateWithChallenge(state, payload);
    default:
      return state;
  }
};

export default challenges;