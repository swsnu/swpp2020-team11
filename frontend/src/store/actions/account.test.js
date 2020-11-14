import axios from 'axios';

import * as actionCreators from './account';
import store, { history } from '../store';

const stubUser = {
  'id': 1,
  'email': 'stub@gmail.com',
};

describe('ActionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it(`'SignIn' should call alert if email or password was wrong`, (done) => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 204,
            data: stubUser,
          };
          resolve(result);
        });
      });

    const spyAlert = jest.spyOn(window, 'alert')
      .mockImplementation(() => {
      });
    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {
      });
    store.dispatch(actionCreators.signIn(
      { 'email': 'dummy', 'password': 'dummy' })).then(() => {
      const newState = store.getState();
      expect(newState.account.isLoggedIn).toBeFalsy();
      expect(newState.account.user).toBeNull();
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyAlert).toHaveBeenCalledTimes(1);
      expect(spyHistory).toHaveBeenCalledTimes(0);
      done();
    });
  });

  it(`'SignIn' should call log if response is not valid`, (done) => {
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

    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {
      });

    store.dispatch(actionCreators.signIn(
      { 'email': 'dummy', 'password': 'dummy' })).then(() => {
      const newState = store.getState();
      expect(newState.account.isLoggedIn).toBeFalsy();
      expect(newState.account.user).toBeNull();
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      expect(spyHistory).toHaveBeenCalledTimes(0);
      done();
    });
  });
  it(`'SignIn' should call reducer if response is correctly`, (done) => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 201,
            data: stubUser,
          };
          resolve(result);
        });
      });

    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {
      });

    store.dispatch(actionCreators.signIn(
      { 'email': 'dummy', 'password': 'dummy' })).then(() => {
      const newState = store.getState();
      expect(newState.account.isLoggedIn).toBeTruthy();
      expect(newState.account.user).toStrictEqual(stubUser);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyHistory).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'SignOut' should call log if response is not valid`, (done) => {
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

    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {
      });

    store.dispatch(actionCreators.signOut()).then(() => {
      const newState = store.getState();
      expect(newState.account.isLoggedIn).toBeTruthy();
      expect(newState.account.user).toBe(stubUser);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      expect(spyHistory).toHaveBeenCalledTimes(0);
      done();
    });
  });
  it(`'SignOut' should call reducer if response is correctly`, (done) => {
    const spyAxios = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
          };
          resolve(result);
        });
      });

    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {
      });

    store.dispatch(actionCreators.signOut()).then(() => {
      const newState = store.getState();
      expect(newState.account.isLoggedIn).toBeFalsy();
      expect(newState.account.user).toBeNull();
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyHistory).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'SignUp' should call alert if email or password was wrong`, (done) => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 204,
          };
          resolve(result);
        });
      });

    const spyAlert = jest.spyOn(window, 'alert')
      .mockImplementation(() => {
      });
    store.dispatch(actionCreators.signUp(
      {
        'email': 'dummy', 'password': 'dummy',
        'nickname': 'dummy', 'phoneNumber': 'dummy'
      })).then(() => {
      const newState = store.getState();
      expect(newState.account.isLoggedIn).toBeFalsy();
      expect(newState.account.user).toBeNull();
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyAlert).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'SignUp' should call log if response is not valid`, (done) => {
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

    store.dispatch(actionCreators.signUp(
      {
        'email': 'dummy', 'password': 'dummy',
        'nickname': 'dummy', 'phoneNumber': 'dummy'
      })).then(() => {
      const newState = store.getState();
      expect(newState.account.isLoggedIn).toBeFalsy();
      expect(newState.account.user).toBeNull();
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'SignUp' should call reducer if response is correctly`, (done) => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 201,
            data: stubUser,
          };
          resolve(result);
        });
      });

    store.dispatch(actionCreators.signUp(
      {
        'email': 'dummy', 'password': 'dummy',
        'nickname': 'dummy', 'phoneNumber': 'dummy'
      })).then(() => {
      const newState = store.getState();
      expect(newState.account.isLoggedIn).toBeTruthy();
      expect(newState.account.user).toStrictEqual(stubUser);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'setPersonality' should call reducer if function is called`, (done) => {
    store.dispatch(actionCreators.setPersonality(1, 10)).then(() => {
      const newState = store.getState();
      expect(newState.account.personalityAnswer).toStrictEqual({ 1: 10 });
      done();
    });
  });
});
