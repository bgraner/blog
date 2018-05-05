import {
  IQuestion
} from '../helpers/checklist';

import { IAction } from '../actions/actionCreators';

import {
  RECEIVE_CHECKLIST
} from '../actions/actionConstants';

const questions = (state = [] as IQuestion[], action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_CHECKLIST:
      return payload.questions.map((question: IQuestion) => {
        const { id, text, category } = question;

        return { id, text, category };
      });
    default:
      return state;
  }
};

export default questions;