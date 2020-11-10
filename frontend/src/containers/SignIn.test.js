import React from 'react';
import { Provider } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import SignIn from './SignIn';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../store/store';
import { getMockStore, stubInitialState } from '../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import * as actionCreators from '../store/actions/account';

function mockSignIn(initialState) {
  const mockStore = getMockStore(initialState);
  return (
    <Provider store={ mockStore }>
      <ConnectedRouter history={ history }>
        <Switch>
          <Route path='/' exact component={ SignIn }/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<SignIn />', () => {
  let signIn;
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
    signIn = mockSignIn;
    spyHistory = jest.spyOn(history, 'push')
      .mockImplementation((user) => {
        return (dispatch) => {
        };
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    const component = mount(signIn(stubInitialState));
    expect(component.find('.SignIn').length).toBe(1);
    expect(component.find('.Login').length).toBe(1);
    expect(component.find(Form).length).toBe(1);
    expect(component.find(Form.Item).length).toBe(5);
    expect(component.find(Input).length).toBe(2);
    expect(component.find(Button).length).toBe(3);
    expect(component.find(Checkbox).length).toBe(1);
  });

  it('should call signIn if user clicks button.', () => {
    const component = mount(signIn(stubInitialState));
    const button = component.find('.login-form-button button');
    const spySignIn = jest.spyOn(actionCreators, 'signIn')
      .mockImplementation(() => {
        return (dispatch) => {};
      });
    button.simulate('click');
    expect(spySignIn).toHaveBeenCalledTimes(1);
  });

  it('should call change value if user inputs email/password.', () => {
    const component = mount(signIn(stubInitialState));
    const wrapper = component.find('SignIn').instance();
    const inputEmail = component.find('.email-input input');
    inputEmail.simulate('change', { target: { value: 'dummy@dummy.dummy' } });
    const inputPassword = component.find('.password-input input');
    inputPassword.simulate('change', { target: { value: 'dummy' } });
    expect(wrapper.state.email).toEqual('dummy@dummy.dummy');
    expect(wrapper.state.password).toEqual('dummy');
  });

  it('should redirect to check page if user click forgot button.', () => {
    const component = mount(signIn(stubInitialState));
    const button = component.find('.login-form-forgot button');
    button.simulate('click');
    expect(spyHistory).toBeCalledWith('/');
  });

  it('should redirect to signup page if user click signup button.', () => {
    const component = mount(signIn(stubInitialState));
    const button = component.find('.signup-button button');
    button.simulate('click');
    expect(spyHistory).toBeCalledWith('/sign_up/');
  });
});
