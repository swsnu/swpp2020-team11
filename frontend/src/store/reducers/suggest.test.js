import * as actionTypes from '../actions/actionTypes';
import reducer from './suggest';
import { stubSuggest, stubInitialSuggestDetail } from '../../test-utils/mocks';

describe('suggest Reducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {}); // initialize
    expect(newState).toEqual({
      suggest: [],
      suggestDetail: stubInitialSuggestDetail,
    });
  });

  it('should modify detail suggestion', () => {
    const newState = reducer(undefined, {
      type: actionTypes.ModifySuggestionDetail,
      key: 'name',
      value: 'test',
    });
    expect(newState).toEqual({
      suggest: [],
      suggestDetail: { ...stubInitialSuggestDetail, name: 'test' },
    });
  });

  it('should clear detail suggestion', () => {
    const newState = reducer(undefined, {
      type: actionTypes.ClearSuggestionDetail,
    });
    expect(newState).toEqual({
      suggest: [],
      suggestDetail: stubInitialSuggestDetail,
    });
  });

  it('should get suggest', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GetSuggestion,
      value: stubSuggest,
    });
    expect(newState).toEqual({
      suggest: stubSuggest,
      suggestDetail: stubInitialSuggestDetail,
    });
  });
});
