import * as actionTypes from './actionTypes';
import axios from 'axios';
import { push } from 'connected-react-router';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
      .catch((err) => {
        console.log(err);
      });
  };
};


export const signOut = () => {
  return (dispatch) => {
    return axios.get('/api/user/logout/')
      .then((res) => {
        dispatch({ type: actionTypes.SignOut });
        dispatch(push('/'));
      })
      .catch((err) => console.log(err));
  };
};


export const signUp = (email, nickname, password, phoneNumber) => {
  return (dispatch) => {
    return axios.post('/api/user/', {
      email: email,
      password: password,
      nickname: nickname,
      phoneNumber: phoneNumber,
    })
      .then((res) => {
        if (res.status === 201) {
          dispatch({ type: actionTypes.SignUp, value: res.data });
        } else {
          alert('This Email or nickname is already taken.');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};


export const setPersonality = (index, answer) => {
  return (dispatch) => {
    dispatch({ type: actionTypes.SetPersonality, index: index, value: answer });
  };
};

