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
        const user = res.data;
        if (true) {
          dispatch(signIn_(user));
          dispatch(push('/articles'));
        } else {
          alert('Email or password is wrong');
        }
      })
      .catch((err) => console.log(err));
  };
};


export const signOut = (user) => {
  return (dispatch) => {
    user.logged_in = false;
    return axios.put('/api/user/' + user.id, user)
      .then((res) => {
        dispatch(push('/login'));
        dispatch({ type: actionTypes.SignOut });
      })
      .catch((err) => console.log(err));
  };
};
