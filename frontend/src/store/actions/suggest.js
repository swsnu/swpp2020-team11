import * as actionTypes from './actionTypes';
import axios from 'axios';
import { push } from 'connected-react-router';
import { message } from 'antd';

export const getSuggest = () => {
  return (dispatch) => {
    return axios.get('/api/suggest/')
      .then((res) => {
        dispatch({ type: actionTypes.GetSuggestion, value: res.data.suggestList });
        return res.data.suggestList;
      })
      .catch((err) => console.log(err));
  };
};

export const getSuggestDetail = (id) => {
  return (dispatch) => {
    return axios.get(`/api/suggest/${ id }/`)
      .then((res) => {
        dispatch({ type: actionTypes.GetSuggestionDetail, value: res.data.suggest });
        dispatch(push(`/suggest/${ id }/edit/`));
        return res.data.suggest;
      })
      .catch((err) => console.log(err));
  };
};

export const changeSuggestionDetail = (key, value) => {
  return (dispatch) => {
    dispatch({ type: actionTypes.ModifySuggestionDetail, key: key, value: value });
  };
};

export const createSuggestionDetail = (data) => {
  return (dispatch) => {
    return axios.post(`/api/suggest/`, data)
      .then((res) => {
        dispatch({ type: actionTypes.ClearSuggestionDetail });
        dispatch(push(`/suggest`));
      })
      .catch((err) => message.error('server response error'));
  };
};

export const putSuggestionDetail = (data) => {
  return (dispatch) => {
    return axios.put(`/api/suggest/${data.id}/`, data)
      .then((res) => {
        dispatch({ type: actionTypes.ClearSuggestionDetail });
        dispatch(push(`/suggest`));
      })
      .catch((err) => message.error('server response error'));
  };
};

export const clearSuggestionDetail = () => {
  return (dispatch) => {
    dispatch({ type: actionTypes.ClearSuggestionDetail });
  };
};
