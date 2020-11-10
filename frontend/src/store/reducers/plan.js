import * as actionTypes from '../actions/actionTypes';

const initialState = {
  plan: null,
  reservation: null,
  history: [],
  review: [],
  reviewDetail: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GetPlan:
      return { ...state, plan: action.value };

    case actionTypes.GetReservation:
      return { ...state, reservation: action.value };

    case actionTypes.GetHistory:
      return { ...state, history: action.value };

    case actionTypes.GetReview:
      return { ...state, review: action.value };

    case actionTypes.CreateReview:
      const newReview = [...state.review];
      action.value.forEach((review) => {
        newReview.push(review);
      });
      return { ...state, review: newReview };

    case actionTypes.ModifyReview:
      const modifyReview = state.reviewDetail.map((review) => {
        if (review.id == action.value.id) {
          return { ...review, score: action.value.score, content: action.value.content };
        } else {
          return { ...review };
        }
      });
      return { ...state, reviewDetail: modifyReview };

    case actionTypes.GetReviewDetail:
      return { ...state, reviewDetail: action.value };

    default:
      break;
  }
  return state;
};

export default reducer;
