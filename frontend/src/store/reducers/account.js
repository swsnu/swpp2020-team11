import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isLoggedIn: false,
  popUpVisible: false,
  user: null,
  personalityAnswer: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SetAccount:
      return { ...state, isLoggedIn: true, user: action.value };

    case actionTypes.SignOut:
      return { ...state, isLoggedIn: false, user: null, popUpVisible: false };

    case actionTypes.SignUp:
      return { ...state, isLoggedIn: true, user: action.value, popUpVisible: true };

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
