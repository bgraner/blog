import { IUser } from '../helpers/auth';
import { ViewAction } from '../actions/actionCreators';
import { LIST_VIEW, UPDATE_VIEW } from '../actions/actionConstants';

const currentView = (state = LIST_VIEW, action = {} as ViewAction) => {
  switch (action.type) {
    case UPDATE_VIEW:
      return action.view;
    default:
      return state;
  }
};

export default currentView