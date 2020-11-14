import React from 'react';
import { Provider } from 'react-redux';
import { Form, Modal } from 'antd';
import SignUp from './SignUp';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../store/store';
import { getMockStore, stubInitialState } from '../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import * as actionCreators from '../store/actions/account';

history.location.pathname = '/sign_up';

const popUpState = {
  account: {
    isLoggedIn: true,
    popUpVisible: true,
    user: null,
  },
  plan: {
    plan: null,
    reservation: null,
    history: [],
    review: [],
    reviewDetail: [],
  },
};

function mockSignUp(initialState) {
  const mockStore = getMockStore(initialState);
  return (
    <Provider store={ mockStore }>
      <ConnectedRouter history={ history }>
        <Switch>
          <Route path='/sign_up' exact component={ SignUp }/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<SignUp />', () => {
  let signUp;
  let spyHistory;

  beforeAll(() => {
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

  beforeEach(() => {
    signUp = mockSignUp;
    spyHistory = jest.spyOn(history, 'push')
      .mockImplementation((user) => {
        return (dispatch) => {
        };
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should render without errors', () => {
    const component = mount(signUp(stubInitialState));
    expect(component.find('.SignUpPage').length).toBe(1);
    expect(component.find('.SignUp').length).toBe(1);
    expect(component.find(Form).length).toBe(1);
    expect(component.find(Modal).length).toBe(1);
  });
  it('should call change value if user inputs email or etc.', () => {
    const component = mount(signUp(stubInitialState));
    const wrapper = component.find('SignUp').instance();
    const inputEmail = component.find('.email-input input');
    inputEmail.simulate('change', { target: { value: 'dummy@dummy.dummy' } });
    const inputPassword = component.find('.password-input input');
    inputPassword.simulate('change', { target: { value: 'dummy' } });
    const inputNickname = component.find('.nickname-input input');
    inputNickname.simulate('change', { target: { value: 'dummy' } });
    const inputPhoneNumber = component.find('.phoneNumber-input input');
    inputPhoneNumber.simulate('change', { target: { value: 'dummy' } });
    expect(wrapper.state.email).toEqual('dummy@dummy.dummy');
    expect(wrapper.state.password).toEqual('dummy');
    expect(wrapper.state.nickname).toEqual('dummy');
    expect(wrapper.state.phoneNumber).toEqual('dummy');
  });
  it('should call signUp if user clicks button.', () => {
    const component = mount(signUp(stubInitialState));
    const button = component.find('.signup-form-button button');
    const spySignIn = jest.spyOn(actionCreators, 'signUp')
      .mockImplementation(() => {
        return (dispatch) => {};
      });
    button.simulate('click');
    expect(spySignIn).toHaveBeenCalledTimes(1);
  });
  it('should redirect to main page if user click no button.', () => {
    const component = mount(signUp(popUpState));
    const button = component.find('.no-button button');
    button.simulate('click');
    expect(spyHistory).toBeCalledWith('/');
  });
  it('should redirect to check page if user click yes button.', () => {
    const component = mount(signUp(popUpState));
    const button = component.find('.yes-button button');
    button.simulate('click');
    expect(spyHistory).toBeCalledWith('/');
  });
  it('should redirect to main page if user click cancel button.', () => {
    const component = mount(signUp(popUpState));
    const button = component.find('.ant-modal-close-x');
    button.simulate('click');
    expect(spyHistory).toBeCalledWith('/');
  });
});
