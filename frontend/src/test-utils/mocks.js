import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router';

import { history, middlewares } from '../store/store';

export const stubInitialState = {
  account: {
    isLoggedIn: false,
    user: null,
    personalityAnswer: {},
  },
  plan: {
    plan: null,
    reservation: null,
    history: [],
    review: [],
    reviewDetail: [],
  },
  suggest: {
    suggest: [],
    suggestDetail: {},
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

export const stubReservation = {
  phoneNumver: '010-5882-5467',
  taxiType: '개인 택시',
  carNumber: '서23울 3175',
  currentLocation: {
    lat: 37.5291281,
    lng: 127.0691572,
  },
  arrivalLocation: {
    lat: 38.5291281,
    lng: 128.0691572,
  },
  taxiImage: 'https://thewiki.ewr1.vultrobjects.com/data/ec8f98eb8' +
    '298ed838020eb89b4eb9dbcec9db4eca68820ed839dec8b9c2e706e67.png',
};

export const stubSuggestDetail = {
  'id': 1,
  'place': { 'name': 'good', 'lat': 30, 'lng': 127, 'score': 0 },
  'updated_at': '2020-12-08T13:27:52.396Z',
  'status': 1,
  'hashTags': ['test'],
};

export const stubSuggest = [
  stubSuggestDetail,
  {
    'id': 2,
    'place': { 'name': 'good', 'lat': 30, 'lng': 127, 'score': 0 },
    'updated_at': '2020-12-08T13:27:52.396Z',
    'status': 2,
    'hashTags': ['test'],
  },
  {
    'id': 3,
    'place': { 'name': 'good', 'lat': 30, 'lng': 127, 'score': 0 },
    'updated_at': '2020-12-08T13:27:52.396Z',
    'status': 3,
    'hashTags': ['test'],
  },
  {
    'id': 4,
    'place': { 'name': 'good', 'lat': 30, 'lng': 127, 'score': 0 },
    'updated_at': '2020-12-08T13:27:52.396Z',
    'status': 3,
    'hashTags': ['test'],
  },
];

const getMockReducer = (initialState) => jest.fn(
  (initialState) => (state = initialState, action) => {
    switch (action.type) {
      default:
        break;
    }
    return state;
  },
)(initialState);

export const getMockStore = (initialState) => {
  const rootReducer = combineReducers({
    account: initialState.account ? getMockReducer(initialState.account) : {},
    plan: initialState.plan ? getMockReducer(initialState.plan) : {},
    suggest: initialState.suggest ? getMockReducer(initialState.suggest) : {},
    router: connectRouter(history),
  });
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const mockStore = createStore(rootReducer,
    composeEnhancers(applyMiddleware(...middlewares)));
  return mockStore;
};
