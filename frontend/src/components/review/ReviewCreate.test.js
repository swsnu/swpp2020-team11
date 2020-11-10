import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { history } from '../../store/store';
import { getMockStore } from '../../test-utils/mocks';
import * as actionCreators from '../../store/actions/plan';
import ReviewCreate from './ReviewCreate';

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
  },
};
const beforeGetHistory = {
  account: stubLogin2,
  plan: {
    history: [],
  },
};

describe('<ReviewCreate/>', () => {
  let reviewCreate;
  let spyGetHistory;
  let spyCreateReview;
  let spyHistoryPush;
  let spyAlert;
  beforeEach(() => {
    history.location.pathname = '/review/1/create';
    reviewCreate = function mockReviewCreate(initialState) {
      const mockStore = getMockStore(initialState);
      return (
        <Provider store={ mockStore }>
          <ConnectedRouter history={ history }>
            <Switch>
              <Route path='/review/:id/create' exact render={() => <ReviewCreate/>}/>
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
    spyCreateReview = jest.spyOn(actionCreators, 'createReview')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    spyHistoryPush = jest.spyOn(history, 'push')
      .mockImplementation((path) => {});
    spyAlert = jest.spyOn(window, 'alert')
      .mockImplementation(() => {
        return;
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ReviewCreate with login', () => {
    const component = mount(reviewCreate(initialStateWithLogin));
    let wrapper = component.find('.reviewCreate');
    const reviewCreateInstance = component.find(ReviewCreate.WrappedComponent).instance();
    expect(wrapper.length).toBe(1);
    expect(spyGetHistory).toHaveBeenCalledTimes(1);
    const wrapper3 = component.find('TextArea').at(0);
    const wrapper2 = component.find('.ant-rate-star .ant-rate-star-second').at(2);
    wrapper3.simulate('change', { target: { value: 'title' } });
    wrapper2.simulate('click');
    wrapper2.simulate('click');
    expect(reviewCreateInstance.state.score[0]).toBe(0);
    expect(reviewCreateInstance.state.comment[0]).toBe('title');
    wrapper = component.find('.ant-steps-item-container').at(1);
    wrapper.simulate('click');
    expect(reviewCreateInstance.state.current).toBe(1);

    wrapper3.simulate('change', { target: { value: 'title' } });
    wrapper2.simulate('click');
    expect(reviewCreateInstance.state.score[1]).toBe(3);
    expect(reviewCreateInstance.state.comment[1]).toBe('title');
    wrapper = component.find('.ant-steps-item-container').at(2);
    wrapper.simulate('click');
    expect(reviewCreateInstance.state.current).toBe(2);

    wrapper3.simulate('change', { target: { value: 'title' } });
    wrapper2.simulate('click');
    expect(reviewCreateInstance.state.score[2]).toBe(3);
    expect(reviewCreateInstance.state.comment[2]).toBe('title');

    wrapper = component.find('#createButton').at(0);
    wrapper.simulate('click');
    expect(spyCreateReview).toHaveBeenCalledTimes(1);
  });
  it('alert message without reviewing place', () => {
    const component = mount(reviewCreate(initialStateWithLogin));
    const wrapper = component.find('.ant-steps-item-container').at(2);
    wrapper.simulate('click');
    const reviewCreateInstance = component.find(ReviewCreate.WrappedComponent).instance();
    expect(reviewCreateInstance.state.current).toBe(0);
    expect(spyAlert).toHaveBeenCalledTimes(1);
  });
  it('click back', () => {
    const component = mount(reviewCreate(initialStateWithLogin));
    const wrapper = component.find('#backButton').at(0);
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
  });
  it('before get history', () => {
    const component = mount(reviewCreate(beforeGetHistory));
    const wrapper = component.find('.empty');
    expect(wrapper.length).toBe(1);
  });
  it('without login', () => {
    mount(reviewCreate(initialStateWithoutLogin));
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
  });
});
