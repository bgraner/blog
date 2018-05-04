import { combineReducers } from 'redux';

const invited = (state = [] as any, action = {} as any) => {
  switch (action.type) {
    default:
      return state;
  }
};

const invitations = (state = [] as any, action = {} as any) => {
  switch (action.type) {
    default:
      return state;
  }
};

const active = (state = [] as any, action = {} as any) => {
  switch (action.type) {
    default:
      return state;
  }
};

const disabled = (state = [] as any, action = {} as any) => {
  switch (action.type) {
    default:
      return state;
  }
};

const friends = combineReducers({
  invited,
  invitations,
  active,
  disabled
});

export default friends;