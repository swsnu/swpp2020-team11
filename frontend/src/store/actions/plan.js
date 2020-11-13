import * as actionTypes from './actionTypes';
import axios from 'axios';
import { push } from 'connected-react-router';

export const getHistory = () => {
  return (dispatch) => {
    return axios.get('/api/plan/history')
      .then((res) => {
        dispatch({ type: actionTypes.GetHistory, value: res.data.history });
        return res.data.history;
      })
      .catch((err) => console.log(err));
  };
};

export const getReview = () => {
  return (dispatch) => {
    return axios.get('/api/plan/review')
      .then((res) => {
        dispatch({ type: actionTypes.GetReview, value: res.data.review });
      })
      .catch((err) => console.log(err));
  };
};

export const getReservation = (user) => {
  return (dispatch) => {
    return axios.get('/api/reservation')
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

export const makeReservation = () => {
  return (dispatch) => {
    return axios.post(`/api/plan/reservation/`)
      .then((res) => {
        dispatch({ type: actionTypes.GetReservation, value: res.data });
        dispatch(push('/plan/reservation'));
      })
      .catch((err) => console.log(err));
  };
};

export const createReview = (review) => {
  return (dispatch) => {
    return axios.post('/api/plan/review/', review)
      .then((res) => {
        dispatch({ type: actionTypes.CreateReview, value: res.data.review });
        dispatch(push('/plan/history'));
      })
      .catch((err) => console.log(err));
  };
};

export const getReviewDetail = (id) => {
  return (dispatch) => {
    return axios.get('/api/plan/review/' + id)
      .then((res) => {
        console.log(res.data);
        dispatch({ type: actionTypes.GetReviewDetail, value: res.data.reviewDetail });
        return res.data.reviewDetail;
      })
      .catch((err) => console.log(err));
  };
};

export const modifyReview = (review) => {
  return (dispatch) => {
    return axios.put('/api/plan/review/' + review.id + '/', review)
      .then((res) => {
        dispatch({ type: actionTypes.ModifyReview, value: res.data });
      })
      .catch((err) => console.log(err));
  };
};


