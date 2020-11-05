import * as actionTypes from '../actions/actionTypes';

const initialState = {
  plan: null,
  reservation: null,
  history: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GetPlan:
      return { ...state, plan: action.value };

    case actionTypes.GetReservation:
      return { ...state, reservation: action.value };

    case actionTypes.GetHistory:
      return { ...state, history: action.value };

    default:
      break;
  }
  return state;
};

export default reducer;
