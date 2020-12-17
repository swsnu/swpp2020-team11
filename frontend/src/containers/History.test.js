import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { history } from '../store/store';
import { getMockStore } from '../test-utils/mocks';
import * as actionCreators from '../store/actions/plan';
import History from './History';

const stubLogin1 = { isLoggedIn: false };
const stubLogin2 = { isLoggedIn: true };
const stubHistory = [{
  'id': 1,
  'place': [{
    'id': 1, 'lat': 37, 'lng': 126, 'name': 'food',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp',
  }, {
    'id': 4, 'lat': 38, 'lng': 126, 'name': 'activity',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp2',
  }, {
    'id': 7, 'lat': 39, 'lng': 126, 'name': 'scenary',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp3',
  }],
  'date': '2020-11-07',
}, {
  'id': 2,
  'place': [{
    'id': 1, 'lat': 37, 'lng': 126, 'name': 'food',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp',
  }, {
    'id': 4, 'lat': 38, 'lng': 126, 'name': 'activity',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp2',
  }, {
    'id': 7, 'lat': 39, 'lng': 126, 'name': 'scenary',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp3',
  }],
  'date': '2020-11-07',
}, {
  'id': 3,
  'place': [{
    'id': 1, 'lat': 37, 'lng': 126, 'name': 'food',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp',
  }, {
    'id': 4, 'lat': 38, 'lng': 126, 'name': 'activity',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp2',
  }, {
    'id': 7, 'lat': 39, 'lng': 126, 'name': 'scenary',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp3',
  }],
  'date': '2020-11-07',
}, {
  'id': 4,
  'place': [{
    'id': 1, 'lat': 37, 'lng': 126, 'name': 'food',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp',
  }, {
    'id': 4, 'lat': 38, 'lng': 126, 'name': 'activity',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp2',
  }, {
    'id': 7, 'lat': 39, 'lng': 126, 'name': 'scenary',
    'img_urls': '../../assets/img/porto1.png', 'tag': 'temp3',
  }],
  'date': '2020-11-07',
}];
const stubReview = [
  { 'id': 1, 'plan': 1, 'place': 1, 'score': 4.0, 'content': 'gd!' },
  { 'id': 2, 'plan': 1, 'place': 4, 'score': 0.0, 'content': '\u314e\u3147' },
  { 'id': 3, 'plan': 1, 'place': 7, 'score': 3.0, 'content': '\u314e\u3147' },
];
const initialStateWithoutLogin = {
  account: stubLogin1,
  plan: {
    history: [],
  },
};
const initialStateWithLogin = {
  account: stubLogin2,
  plan: {
    history: stubHistory,
    review: stubReview,
  },
};
describe('<History/>', () => {
  let history1;
  let spyGetHistory;
  let spyGetReview;
  beforeEach(() => {
    history1 = function mockHistory(initialState) {
      const mockStore = getMockStore(initialState);
      return (
        <Provider store={ mockStore }>
          <ConnectedRouter history={ history }>
            <Switch>
              <Route path='/' exact component = {History}/>
            </Switch>
          </ConnectedRouter>
        </Provider>
      );
    };
    spyGetHistory = jest.spyOn(actionCreators, 'getHistory')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    spyGetReview = jest.spyOn(actionCreators, 'getReview')
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
  it('should render History with login', () => {
    const component = mount(history1(initialStateWithLogin));
    const wrapper = component.find('.history');
    expect(wrapper.length).toBe(1);
    expect(spyGetReview).toHaveBeenCalledTimes(1);
    expect(spyGetHistory).toHaveBeenCalledTimes(1);
  });
  it('should change pagination', () => {
    const component = mount(history1(initialStateWithLogin));
    const wrapper = component.find('.ant-pagination-item-2');
    wrapper.simulate('click');
    const historyInstance = component.find(History.WrappedComponent).instance();
    expect(historyInstance.state.page).toEqual(2);
  });
  it('without login', () => {
    const component = mount(history1(initialStateWithoutLogin));
    expect(component.find('.empty')).toHaveLength(1);
  });
  it('should redirect to main page if user click button.', () => {
    const component = mount(history1(initialStateWithoutLogin));
    const button = component.find('button').at(0);
    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    button.simulate('click');
    expect(spyHistory).toHaveBeenCalledWith('/');
  });
});

