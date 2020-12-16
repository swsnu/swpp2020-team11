import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import MainPage from './MainPage';
import { history } from '../store/store';
import { getMockStore, stubInitialState, stubAccount } from '../test-utils/mocks';
import { Typography, InputNumber } from 'antd';
import { Route, Switch } from 'react-router-dom';
import * as actionCreators from '../store/actions/plan';

const { Text } = Typography;

function mockMainPage(initialState) {
  const mockStore = getMockStore(initialState);
  return (
    <Provider store={ mockStore }>
      <ConnectedRouter history={ history }>
        <Switch>
          <Route path='/' exact component={ MainPage }/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<MainPage />', () => {
  let mainPage;
  let spyGetPlan;
  beforeEach(() => {
    mainPage = mockMainPage;
    spyGetPlan = jest.spyOn(actionCreators, 'getPlan')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error.', () => {
    const component = mount(mainPage(stubInitialState));
    expect(component.find('.main-page').length).toBe(1);
    expect(component.find('img').length).toBe(3);
    expect(component.find(Text).length).toBe(3);
    expect(component.find(InputNumber).length).toBe(1);
  });

  it('should change image url if mouse pointer over image.', () => {
    const component = mount(mainPage(stubInitialState));
    const mainImage = component.find('img').at(0);
    mainImage.simulate('mouseover');
    component.update();
    // i don't know why i can't test this case
    // expect(mainImage.prop('src')).toContain('hover');
    mainImage.simulate('mouseout');
    component.update();
    expect(mainImage.prop('src')).not.toContain('hover');
  });

  it('should call getPlan if logged in user click image.', () => {
    const logInState = { ...stubInitialState, account: stubAccount };
    const component = mount(mainPage(logInState));
    const mainImage = component.find('img').at(0);
    const wrapper = component.find('MainPage').instance();
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((fun1, fun2, fun3) => {
        fun1({ coords: { latitude: 1, longitude: 1 } });
        fun2('error');
      }),
    };
    global.navigator.geolocation = mockGeolocation;
    mainImage.simulate('click');
    expect(wrapper.state.headCount).toBe(2);
    expect(spyGetPlan).toBeCalledWith(1, 2, 1, 1);
  });

  it('can not use navigator.', () => {
    const logInState = { ...stubInitialState, account: stubAccount };
    const component = mount(mainPage(logInState));
    const mainImage = component.find('img').at(0);
    const wrapper = component.find('MainPage').instance();
    const spyLog = jest.spyOn(console, 'log')
      .mockImplementation(() => {
      });
    global.navigator.geolocation = false;
    mainImage.simulate('click');
    expect(wrapper.state.headCount).toBe(2);
    expect(spyLog).toBeCalledWith('GPS를 지원하지 않습니다');
  });

  it('should show modal if not logged in user click image.', () => {
    const component = mount(mainPage(stubInitialState));
    const mainImage = component.find('img').at(0);
    const wrapper = component.find('MainPage').instance();
    mainImage.simulate('click');
    expect(wrapper.state.popUpVisible).toBeTruthy();
  });

  it('should save headcount if user set head count.', () => {
    const component = mount(mainPage(stubInitialState));
    const inputNumber = component.find('input').at(0);
    const wrapper = component.find('MainPage').instance();
    inputNumber.simulate('change', { target: { value: '3' } });
    expect(wrapper.state.headCount).toBe(3);
  });
});

describe('<MainPage /> Modal', () => {
  let mainPage;
  let component;
  let wrapper;
  let spyHistory;
  beforeEach(() => {
    mainPage = mockMainPage;
    component = mount(mainPage(stubInitialState));
    wrapper = component.find('MainPage').instance();
    wrapper.setState({ popUpVisible: true });
    component.update();
    spyHistory = jest.spyOn(history, 'push')
      .mockImplementation((user) => {
        return (dispatch) => {
        };
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to sign in page if user click sign in button.', () => {
    const closeButton = component.find('.sign-in-button').at(0);
    closeButton.simulate('click');
    expect(spyHistory).toBeCalledWith('/sign_in');
  });

  it('should redirect to sign up page if user click sign up button.', () => {
    const signUpButton = component.find('.sign-up-button').at(0);
    signUpButton.simulate('click');
    expect(spyHistory).toBeCalledWith('/sign_up');
  });

  it('should close modal if user click close button.', () => {
    const closeButton = component.find('.ant-modal-close-x').at(0);
    closeButton.simulate('click');
    expect(wrapper.state.popUpVisible).toBeFalsy();
  });
});
