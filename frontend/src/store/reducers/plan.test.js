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
  'status': 'reviewed',
  'score': 3.5,
  'startTime': '1/23 18:30',
  'endTime': '1/23 23:30',
  'locations': [{
    'latitude': 120,
    'longitude': 220,
  }],
}];


describe('plan Reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {}); // initialize
    expect(newState).toEqual({ plan: null, reservation: null, history: [] });
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
    });
  });
});
