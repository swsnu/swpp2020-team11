import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isLoggedIn: false,
  user: null,
  personalityAnswer: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SignIn:
      return { ...state, isLoggedIn: true, user: action.value };

    case actionTypes.SignOut:
      return { ...state, isLoggedIn: false, user: null };

    case actionTypes.SignUp:
      return { ...state, isLoggedIn: true, user: action.value };

    case actionTypes.SetPersonality:
      const newPersonalityAnswer = {
        ...state.personalityAnswer,
        [action.index]: action.value,
      };
      return { ...state, personalityAnswer: newPersonalityAnswer };

    default:
      break;
  }
  return state;
};

export default reducer;
