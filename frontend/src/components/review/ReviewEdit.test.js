import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { history } from '../../store/store';
import { getMockStore } from '../../test-utils/mocks';
import * as actionCreators from '../../store/actions/plan';
import ReviewEdit from './ReviewEdit';

const stubLogin1 = { isLoggedIn: false };
const stubLogin2 = { isLoggedIn: true };
const reviewDetail = [
  { 'id': 1, 'plan': 1, 'place': 1, 'score': 4,
    'content': 'temp', 'url': '../../assets/img/porto1.png'},
  { 'id': 2, 'plan': 1, 'place': 2, 'score': 3,
    'content': 'temp2', 'url': '../../assets/img/porto1.png'},
  { 'id': 3, 'plan': 1, 'place': 3, 'score': 2,
    'content': 'temp3', 'url': '../../assets/img/porto1.png'}
]
const initialStateWithoutLogin = {
  account: stubLogin1,
  plan: {
    reviewDetail: [],
  },
};
const initialStateWithLogin = {
  account: stubLogin2,
  plan: {
    reviewDetail: reviewDetail,
  },
};
const beforeGetReviewDetail = {
  account: stubLogin2,
  plan: {
    reviewDetail: [],
  },
};

describe('<ReviewCreate/>', () => {
  let reviewEdit;
  let spyGetReviewDetail;
  let spyModifyReview;
  let spyHistoryPush;
  let spyConfirm;
  beforeEach(() => {
    history.location.pathname = '/review/2/edit';
    reviewEdit = function mockReviewEdit(initialState) {
      const mockStore = getMockStore(initialState);
      return (
        <Provider store={ mockStore }>
          <ConnectedRouter history={ history }>
            <Switch>
              <Route path='/review/:id/edit' exact render={() => <ReviewEdit/>}/>
            </Switch>
          </ConnectedRouter>
        </Provider>
      );
    };
    spyGetReviewDetail = jest.spyOn(actionCreators, 'getReviewDetail')
      .mockImplementation((id) => {
        return (dispatch) => {
          return new Promise((resolve, reject) => {
            const result = reviewDetail;
            resolve(result);
          });
        };
      });
    spyModifyReview = jest.spyOn(actionCreators, 'modifyReview')
      .mockImplementation((review) => {
        return (dispatch) => {
        };
      });
    spyHistoryPush = jest.spyOn(history, 'push')
      .mockImplementation((path) => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render ReviewEdit with login', () => {
    spyConfirm = jest.spyOn(window, 'confirm')
      .mockImplementation(() => {
        return false;
      });
    const component = mount(reviewEdit(initialStateWithLogin));
    let wrapper = component.find('.reviewEdit');
    const reviewEditInstance = component.find(ReviewEdit.WrappedComponent).instance();
    expect(wrapper.length).toBe(1);
    expect(spyGetReviewDetail).toHaveBeenCalledTimes(1);
    const wrapper3 = component.find('TextArea').at(0);
    const wrapper2 = component.find('.ant-rate-star .ant-rate-star-second').at(2);
    wrapper3.simulate('change', { target: { value: 'title' } });
    wrapper2.simulate('click');
    wrapper2.simulate('click');
    expect(reviewEditInstance.state.score).toBe(0);
    expect(reviewEditInstance.state.comment).toBe('title');
    expect(reviewEditInstance.state.save).toBe(false);
    wrapper = component.find('.ant-steps-item-container').at(1);
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledTimes(0);
    expect(spyConfirm).toHaveBeenCalledTimes(1);
    const wrapper4 = component.find('#saveButton').at(0);
    wrapper4.simulate('click');
    expect(spyModifyReview).toHaveBeenCalledTimes(1);
    expect(reviewEditInstance.state.save).toBe(true);
    
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
  });
  it('confirm true', () => {
    spyConfirm = jest.spyOn(window, 'confirm')
      .mockImplementation(() => {
        return true;
      });
    const component = mount(reviewEdit(initialStateWithLogin));
    let wrapper = component.find('.reviewEdit');
    expect(wrapper.length).toBe(1);
    expect(spyGetReviewDetail).toHaveBeenCalledTimes(1);
    const wrapper2 = component.find('.ant-rate-star .ant-rate-star-second').at(3);
    wrapper2.simulate('click');
    wrapper = component.find('.ant-steps-item-container').at(2);
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
    expect(spyConfirm).toHaveBeenCalledTimes(1);
  });
  it('click back', () => {
    const component = mount(reviewEdit(initialStateWithLogin));
    const wrapper = component.find('#backButton').at(0);
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
  });
  it('before get history', () => {
    const component = mount(reviewEdit(beforeGetReviewDetail));
    const wrapper = component.find('.empty');
    expect(wrapper.length).toBe(1);
  });
  it('without login', () => {
    mount(reviewEdit(initialStateWithoutLogin));
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
  });
});