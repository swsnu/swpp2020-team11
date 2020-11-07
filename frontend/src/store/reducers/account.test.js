// import React from 'react';
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
    expect(newState).toEqual({ isLoggedIn: false, user: null });
  });
  it('should sign in', () => {
    const newState = reducer(undefined, {
      type: actionTypes.SignIn,
      value: stubUser,
    });
    expect(newState).toEqual({
      isLoggedIn: true,
      user: stubUser,
    });
  });

  it('should sign out', () => {
    const newState = reducer(undefined, {
      type: actionTypes.SignOut,
    });
    expect(newState).toEqual({
      isLoggedIn: false,
      user: null,
    });
  });
});
