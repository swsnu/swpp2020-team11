import * as actionTypes from '../actions/actionTypes';

const initialState = {
  suggest: [],
  suggestDetail: {
    hashedImageKey: '',
    name: '',
    explanation: '',
    tags: '',
    extraAddress: '',
    roadAddress: '',
    location: {
      lng: 0,
      lat: 0,
    },
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GetSuggestion:
      return { ...state, suggest: action.value };

    case actionTypes.GetSuggestionDetail:
      return { ...state, suggestDetail: action.value };

    case actionTypes.ClearSuggestionDetail:
      return {
        ...state,
        suggestDetail: {
          hashedImageKey: '',
          name: '',
          explanation: '',
          tags: '',
          extraAddress: '',
          roadAddress: '',
          location: {
            lng: 0,
            lat: 0,
          },
        },
      };

    case actionTypes.ModifySuggestionDetail:
      const newDetail = { ...state.suggestDetail, [action.key]: action.value };
      return { ...state, suggestDetail: newDetail };

    default:
      break;
  }
  return state;
};

export default reducer;
