import axios from 'axios';

import * as actionCreators from './plan';
import store from '../store';

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

describe('ActionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it(`'getPlan' should log if response is not valid`, (done) => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 400,
          };
          reject(result);
        });
      });

    const spyLog = jest.spyOn(console, 'log')
      .mockImplementation(() => {
      });

    store.dispatch(actionCreators.getPlan()).then(() => {
      const newState = store.getState();
      expect(newState.plan.plan).toBeNull();
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getPlan' get plan if response is valid`, (done) => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubPlan,
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getPlan()).then(() => {
      const newState = store.getState();
      expect(newState.plan.plan).toBe(stubPlan);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getReservation' should log if response is not valid`, (done) => {
    const spyAxios = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 400,
          };
          reject(result);
        });
      });

    const spyLog = jest.spyOn(console, 'log')
      .mockImplementation(() => {
      });

    store.dispatch(actionCreators.getReservation()).then(() => {
      const newState = store.getState();
      expect(newState.plan.reservation).toBeNull();
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getReservation' get reservation if response is valid`, (done) => {
    const spyAxios = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubReservation,
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getReservation()).then(() => {
      const newState = store.getState();
      expect(newState.plan.reservation).toBe(stubReservation);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'getHistory' should log if response is not valid`, (done) => {
    const spyAxios = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 400,
          };
          reject(result);
        });
      });

    const spyLog = jest.spyOn(console, 'log')
      .mockImplementation(() => {
      });

    store.dispatch(actionCreators.getHistory()).then(() => {
      const newState = store.getState();
      expect(newState.plan.history).toStrictEqual([]);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getHistory' get history if response is valid`, (done) => {
    const spyAxios = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubHistory,
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getHistory()).then(() => {
      const newState = store.getState();
      expect(newState.plan.history).toBe(stubHistory);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
