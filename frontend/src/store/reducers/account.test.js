import reducer from './account';
import * as actionTypes from '../actions/actionTypes';

// Please add more attribute
const stubUser = {
  'id': 1,
  'email': 'stub@gmail.com',
};

describe('account Reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {}); // initialize
    expect(newState).toEqual({ isLoggedIn: false, user: null, personalityAnswer: {} });
  });
  it('should sign in', () => {
    const newState = reducer(undefined, {
      type: actionTypes.SignIn,
      value: stubUser,
    });
    expect(newState).toEqual({
      isLoggedIn: true,
      user: stubUser,
      personalityAnswer: {},
    });
  });

  it('should sign out', () => {
    const newState = reducer(undefined, {
      type: actionTypes.SignOut,
    });
    expect(newState).toEqual({
      isLoggedIn: false,
      user: null,
      personalityAnswer: {},
    });
  });

  it('should set personality', () => {
    const newState = reducer(undefined, {
      type: actionTypes.SetPersonality,
      index: 1,
      value: 10,
    });
    expect(newState).toEqual({
      isLoggedIn: false,
      user: null,
      personalityAnswer: { 1: 10 },
    });
  });
});
