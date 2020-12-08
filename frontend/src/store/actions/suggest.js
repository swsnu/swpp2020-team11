import * as actionTypes from './actionTypes';
import axios from 'axios';
import { push } from 'connected-react-router';

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
    return axios.get(`/api/suggest/${id}/`)
      .then((res) => {
        dispatch({ type: actionTypes.GetSuggestionDetail, value: res.data.suggest });
        dispatch(push(`/suggest/${id}`));
        return res.data.suggest;
      })
      .catch((err) => console.log(err));
  };
};


