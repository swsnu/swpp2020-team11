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

const stubHistory = { 'history': [{
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
}],
};

const stubReview = [
  { 'id': 1, 'plan': 1, 'place': 1, 'score': 4.0, 'content': 'gd!' },
  { 'id': 2, 'plan': 1, 'place': 4, 'score': 0.0, 'content': '\u314e\u3147' },
  { 'id': 3, 'plan': 1, 'place': 7, 'score': 3.0, 'content': '\u314e\u3147' },
];

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
  it(`'makeReservation' should log if response is not valid`, (done) => {
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

    store.dispatch(actionCreators.makeReservation()).then(() => {
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

  it(`'makeReservation' get reservation if response is valid`, (done) => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubReservation,
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.makeReservation()).then(() => {
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
  it(`'getHistory' get history if response is valid`, (done)=>{
    const history = stubHistory;
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: history,
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getHistory()).then(() => {
      const newState = store.getState();
      expect(newState.plan.history).toBe(history.history);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getReview' get review if response is valid`, (done)=>{
    const review = { 'review': stubReview };
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: review,
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getReview()).then(() => {
      const newState = store.getState();
      expect(newState.plan.review).toBe(review.review);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getReview' get review if response is invalid`, (done)=>{
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
    store.dispatch(actionCreators.getReview()).then(() => {
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`createReview should create review correctly`, (done) => {
    const newReview = { 'review': stubReview };
    const spy = jest.spyOn(axios, 'post')
      .mockImplementation((url, review) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: newReview,
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.createReview(newReview)).then(() => {
      const newState = store.getState();
      expect(newState.plan.review.length).toEqual(6);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`createReview fails`, (done) => {
    const newReview = { 'review': stubReview };
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url, review) => {
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
    store.dispatch(actionCreators.createReview(newReview)).then(() => {
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getReviewDetail' get reviewDetail if response is valid`, (done)=>{
    const review = { 'reviewDetail': stubReview };
    const spy = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: review,
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getReviewDetail()).then(() => {
      const newState = store.getState();
      expect(newState.plan.reviewDetail).toBe(review.reviewDetail);
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getReviewDetail' get reviewDetail if response is invalid`, (done)=>{
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
    store.dispatch(actionCreators.getReviewDetail()).then(() => {
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'modifyReview' modify reviewDetail if response is valid`, (done)=>{
    const reviewModify = stubReview[0];
    reviewModify['id'] = 1;
    const spyAxios = jest.spyOn(axios, 'put')
      .mockImplementation((url, review) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 201,
            data: stubReview[0],
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.modifyReview(reviewModify)).then(() => {
      const newState = store.getState();
      expect(newState.plan.reviewDetail[0].content).toEqual(stubReview[0].content);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'modifyReview' modify reviewDetail if response is invalid`, (done)=>{
    const reviewModify = stubReview[0];
    reviewModify['id'] = 1;
    const spyAxios = jest.spyOn(axios, 'put')
      .mockImplementation((url, review) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: r00,
          };
          reject(result);
        });
      });
    const spyLog = jest.spyOn(console, 'log')
      .mockImplementation(() => {
      });
    store.dispatch(actionCreators.modifyReview(reviewModify)).then(() => {
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
