import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { history } from '../store/store';
import { getMockStore, stubInitialState, stubSuggest } from '../test-utils/mocks';
import Suggestion from './Suggestion';

jest.mock('../components/suggest/SuggestItem', () => {
  return function mockSuggestion({ suggest }) {
    return (<div key={ suggest.id } className="spySuggestItem"/>);
  };
});

describe('<Suggestion/>', () => {
  let suggestion;
  let spyHistory;
  beforeEach(() => {
    suggestion = function mockHistory(initialState) {
      const mockStore = getMockStore(initialState);
      return (
        <Provider store={ mockStore }>
          <ConnectedRouter history={ history }>
            <Switch>
              <Route path='/' exact component={ Suggestion }/>
            </Switch>
          </ConnectedRouter>
        </Provider>
      );
    };

    spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))(query),
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Suggestion without error', () => {
    const component = mount(suggestion(stubInitialState));
    expect(component.find('.suggestTitle').length).toBe(1);
    expect(component.find('.suggestList').length).toBe(1);
    expect(component.find('.newSuggestButton button').length).toBe(1);
    expect(component.find('.empty').length).toBe(1);
  });

  it('should render Suggestion with many suggestions', () => {
    const stubSuggestState = {
      ...stubInitialState,
      suggest: {
        ...stubInitialState.suggest,
        suggest: stubSuggest,
      },
    };
    const component = mount(suggestion(stubSuggestState));
    expect(component.find('.suggest').length).toBe(1);
    expect(component.find('.spySuggestItem').length).toBe(3);
  });

  it('should change page if change page', () => {
    const stubSuggestState = {
      ...stubInitialState,
      suggest: {
        ...stubInitialState.suggest,
        suggest: stubSuggest,
      },
    };
    const component = mount(suggestion(stubSuggestState));
    const wrapper = component.find('.ant-pagination-item-2');
    wrapper.simulate('click');
    const historyInstance = component.find(Suggestion.WrappedComponent).instance();
    expect(historyInstance.state.page).toEqual(2);
  });

  it('should redirect to create page if click create button', () => {
    const component = mount(suggestion(stubInitialState));
    const button = component.find('.newSuggestButton button');
    button.simulate('click');
    expect(spyHistory).toHaveBeenCalled();
  });
});

