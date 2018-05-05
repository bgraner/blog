import { IUser } from '../helpers/auth';
import { IAction } from '../actions/actionCreators';
import { RECEIVE_CURRENT_USER } from '../actions/actionConstants';

const currentUser = (state = null as IUser, action = {} as IAction) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.payload;
    default:
      return state;
  }
};

export default currentUser;
