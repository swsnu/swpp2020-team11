import * as actionTypes from './actionTypes';
import axios from 'axios';
import { push } from 'connected-react-router';

export const getHistory = () => {
  return (dispatch) => {
    return axios.get('/api/plan/')
      .then((res) => {
        dispatch({ type: actionTypes.GetHistory, value: res.data });
        dispatch(push('/plan/history/'));
      })
      .catch((err) => console.log(err));
  };
};

export const getReservation = (user) => {
  return (dispatch) => {
    return axios.get('/api/plan/reservation')
      .then((res) => {
        dispatch({ type: actionTypes.GetReservation, value: res.data });
        dispatch(push('/plan/reservation'));
      })
      .catch((err) => console.log(err));
  };
};

export const getPlan = (level, headCount) => {
  return (dispatch) => {
    return axios.post(`/api/plan/`, {
      level: level,
      headCount: headCount,
    })
      .then((res) => {
        dispatch({ type: actionTypes.GetPlan, value: res.data });
        dispatch(push('/plan'));
      })
      .catch((err) => console.log(err));
  };
};
