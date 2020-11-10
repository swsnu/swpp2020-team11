import * as actionTypes from '../actions/actionTypes';
import reducer from './plan';

const stubPlan = {
  'headCount': 1,
  'expectedDuration': '10:00',
  'startTime': '1/23 18:30',
  'endTime': '1/23 23:30',
  'expectedBudget': '300000',
};

const stubReservation = {
  'headCount': 1,
  'taxiNumber': '23가2372',
  'Destination': {
    'latitude': 120,
    'longitude': 220,
  },
  'expectedArriveTime': '17:25',
};

const stubHistory = [{
  'id': 1,
  'place': [{
    'id': 1, 'lat': 37, 'lng': 126, 'name': 'food',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp',
  }, {
    'id': 2, 'lat': 38, 'lng': 126, 'name': 'activity',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp2',
  }, {
    'id': 3, 'lat': 39, 'lng': 126, 'name': 'scenary',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp3',
  }],
  'date': '2020-11-07',
}];

const stubReview = [
  { 'id': 1, 'plan': 1, 'place': 1, 'score': 4.0, 'content': 'gd' },
  { 'id': 2, 'plan': 1, 'place': 4, 'score': 0.0, 'content': '\u314e\u3147' },
  { 'id': 3, 'plan': 1, 'place': 7, 'score': 3.0, 'content': '\u314e\u3147' },
];
// 'status': 'reviewed',
//   'score': 3.5,
//   'startTime': '1/23 18:30',
//   'endTime': '1/23 23:30',
//   'locations': [{
//     'latitude': 120,
//     'longitude': 220,
//   }],

describe('plan Reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {}); // initialize
    expect(newState).toEqual({ plan: null, reservation: null, history: [],
      review: [], reviewDetail: [] });
  });
  it('should get plan', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GetPlan,
      value: stubPlan,
    });
    expect(newState).toEqual({
      plan: stubPlan,
      reservation: null,
      history: [],
      review: [],
      reviewDetail: [],
    });
  });

  it('should get reservation', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GetReservation,
      value: stubReservation,
    });
    expect(newState).toEqual({
      plan: null,
      reservation: stubReservation,
      history: [],
      review: [],
      reviewDetail: [],
    });
  });

  it('should get history', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GetHistory,
      value: stubHistory,
    });
    expect(newState).toEqual({
      plan: null,
      reservation: null,
      history: stubHistory,
      review: [],
      reviewDetail: [],
    });
  });
  it('should get review', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GetReview,
      value: stubReview,
    });
    expect(newState).toEqual({
      plan: null,
      reservation: null,
      history: [],
      review: stubReview,
      reviewDetail: [],
    });
  });
  it('should create review', () => {
    const newState = reducer(undefined, {
      type: actionTypes.CreateReview,
      value: stubReview,
    });
    expect(newState.review).toEqual(stubReview);
  });
  it('should modify review', () => {
    const newState = reducer({ reviewDetail: stubReview }, {
      type: actionTypes.ModifyReview,
      value: { 'id': 1, 'plan': 1, 'place': 1, 'score': 3.0, 'content': 'bye' },
    });
    expect(newState.reviewDetail[0].score).toEqual(3.0);
    expect(newState.reviewDetail[0].content).toEqual('bye');
  });
  it('should get reviewDetail', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GetReviewDetail,
      value: stubReview,
    });
    expect(newState.reviewDetail).toEqual(stubReview);
  });
});
