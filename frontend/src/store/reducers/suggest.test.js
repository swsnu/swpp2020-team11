import * as actionTypes from '../actions/actionTypes';
import reducer from './suggest';
import { stubSuggest, stubSuggestDetail } from '../../test-utils/mocks';

describe('suggest Reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {}); // initialize
    expect(newState).toEqual({
      suggest: [],
      suggestDetail: {},
    });
  });

  it('should get suggest', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GetSuggestion,
      value: stubSuggest,
    });
    expect(newState).toEqual({
      suggest: stubSuggest,
      suggestDetail: {},
    });
  });

  it('should get detail suggestion', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GetSuggestionDetail,
      value: stubSuggestDetail,
    });
    expect(newState).toEqual({
      suggest: [],
      suggestDetail: stubSuggestDetail,
    });
  });
});
