import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router';

import { history, middlewares } from '../store/store';

export const stubInitialState = {
  account: {
    isLoggedIn: false,
    user: null,
  },
  plan: {
    plan: null,
    reservation: null,
    history: [],
    review: [],
    reviewDetail: [],
  },
};

const getMockAccountReducer = (initialState) => jest.fn(
  (initialState) => (state = initialState, action) => {
    switch (action.type) {
      default:
        break;
    }
    return state;
  },
)(initialState);

const getMockPlanReducer = (initialState) => jest.fn(
  (initialState) => (state = initialState, action) => {
    switch (action.type) {
      default:
        break;
    }
    return state;
  },
)(initialState);


export const getMockStore = (initialState) => {
  const mockAccountReducer = getMockAccountReducer(initialState.account);
  const mockPlanReducer = getMockPlanReducer(initialState.plan);
  const rootReducer = combineReducers({
    account: mockAccountReducer,
    plan: mockPlanReducer,
    router: connectRouter(history),
  });
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const mockStore = createStore(rootReducer,
    composeEnhancers(applyMiddleware(...middlewares)));
  return mockStore;
};
