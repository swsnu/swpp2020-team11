import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isLoggedIn: [],
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SignIn:
      return { ...state, isLoggedIn: true, user: action.value };

    case actionTypes.SignOut:
      return { ...state, isLoggedIn: false, user: null };

    default:
      break;
  }
  return state;
};

export default reducer;
