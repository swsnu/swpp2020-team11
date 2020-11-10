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

export const stubAccount = {
  isLoggedIn: true,
  user: {
    id: 10,
  },
};

export const stubPlan = {
  plan: null,
  reservation: null,
  history: [],
};

export const stubSinglePlan = {
  imageUrls: [
    'http://www.puzzlesarang.com/shop/data/goods/1569406172621m0.jpg',
    'https://img.huffingtonpost.com/asset/5bf24ac824000060045835ff.jpeg?' +
    'ops=scalefit_720_noupscale&format=webp',
    'https://pbs.twimg.com/media/Dxai_-gUYAEktpi?format=jpg&name=medium',
  ],
  hashTags: [
    '조용한',
    '고급스러운',
    '경치가 아름다운',
  ],
  information: {
    headCount: 2,
    startTime: '1/23 18:30',
    endTime: '1/23 23:30',
    expectedBudget: '300000',
    travelDistance: '150000',
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
