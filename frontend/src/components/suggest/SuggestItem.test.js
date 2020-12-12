import React from 'react';
import { mount } from 'enzyme';
import SuggestItem from './SuggestItem';
import { history } from '../../store/store';
import { getMockStore, stubInitialState, stubSuggestListItem } from '../../test-utils/mocks';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import axios from 'axios';

const mockStore = getMockStore(stubInitialState);

describe('<SuggestItem/>', () => {
  let suggestItem;
  beforeEach(() => {
    suggestItem = function mockSuggestItem(stubSuggest) {
      return (
        <Provider store={ mockStore }>
          <ConnectedRouter history={ history }>
            <SuggestItem suggest={ stubSuggest }/>
          </ConnectedRouter>
        </Provider>
      );
    };
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

  it('render without render', () => {
    const stubApprovedSuggest = { ...stubSuggestListItem, status: 3 };
    const component = mount(suggestItem(stubApprovedSuggest));
    expect(component.find('.suggestItem')).toHaveLength(1);
  });

  it('click Modify', () => {
    const component = mount(suggestItem(stubSuggestListItem));
    const spyGet = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubSuggestListItem,
          };
          resolve(result);
        });
      });

    const button = component.find('.modifyButton button');
    button.simulate('click');
    expect(spyGet).toHaveBeenCalledWith('/api/suggest/1/');
  });
});
