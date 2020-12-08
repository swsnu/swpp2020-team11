import axios from 'axios';

import * as actionCreators from './suggest';
import store from '../store';
import { stubSuggest, stubSuggestDetail } from '../../test-utils/mocks';

describe('ActionCreators', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`'getSuggest' should log if response is not valid`, (done) => {
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

    store.dispatch(actionCreators.getSuggest()).then(() => {
      const newState = store.getState();
      expect(newState.suggest.suggest).toStrictEqual([]);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it(`'getSuggest' get suggest if response is valid`, (done) => {
    const spyAxios = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: { 'suggestList': stubSuggest },
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getSuggest()).then(() => {
      const newState = store.getState();
      expect(newState.suggest.suggest).toBe(stubSuggest);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getSuggestDetail' should log if response is not valid`, (done) => {
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

    store.dispatch(actionCreators.getSuggestDetail(1)).then(() => {
      const newState = store.getState();
      expect(newState.suggest.suggestDetail).toStrictEqual({});
      expect(spyAxios).toHaveBeenCalledTimes(1);
      expect(spyLog).toHaveBeenCalledTimes(1);
      done();
    });
  });
  it(`'getSuggestDetail' get suggest detail if response is valid`, (done) => {
    const spyAxios = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: { 'suggest': stubSuggestDetail },
          };
          resolve(result);
        });
      });
    store.dispatch(actionCreators.getSuggestDetail(1)).then(() => {
      const newState = store.getState();
      expect(newState.suggest.suggestDetail).toBe(stubSuggestDetail);
      expect(spyAxios).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
