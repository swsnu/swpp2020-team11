import * as actionTypes from '../actions/actionTypes';

const initialState = {
  suggest: [],
  suggestDetail: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GetSuggestion:
      return { ...state, suggest: action.value };

    case actionTypes.GetSuggestionDetail:
      return { ...state, suggestDetail: action.value };

    default:
      break;
  }
  return state;
};

export default reducer;
