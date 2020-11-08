import * as actionTypes from './actionTypes';
import axios from 'axios';
import { push } from 'connected-react-router';

export const signIn = (email, password) => {
  return (dispatch) => {
    return axios.post('/api/user/login/', {
      email: email,
      password: password,
    })
      .then((res) => {
        if (res.status === 201) {
          dispatch({ type: actionTypes.SignIn, value: res.data });
          dispatch(push('/'));
        } else {
          alert('Email or password is wrong');
        }
      })
      .catch((err) => console.log(err));
  };
};


export const signOut = () => {
  return (dispatch) => {
    return axios.get('/api/user/logout')
      .then((res) => {
        dispatch({ type: actionTypes.SignOut });
        dispatch(push('/'));
      })
      .catch((err) => console.log(err));
  };
};
