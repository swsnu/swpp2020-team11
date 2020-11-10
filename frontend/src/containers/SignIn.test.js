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

history.location.pathname = '/sign_in';

function mockSignIn(initialState) {
  const mockStore = getMockStore(initialState);
  return (
    <Provider store={ mockStore }>
      <ConnectedRouter history={ history }>
        <Switch>
          <Route path='/sign_in' exact component={ SignIn }/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<SignIn />', () => {
  let signIn;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    const component = mount(signIn(stubInitialState));
    expect(component.find('.SignIn').length).toBe(1);
    expect(component.find('.Login').length).toBe(1);
    expect(component.find('form').length).toBe(1);
    expect(component.find('input').length).toBe(3);
    expect(component.find('button').length).toBe(1);
  });

  it('should call signIn if user clicks button.', () => {
    const component = mount(signIn(stubInitialState));
    const inputEmail = component.find('#normal_login_email').at(0);
    inputEmail.simulate('change', { target: { value: 'dummy@dummy.dummy' } });
    const inputPassword = component.find('#normal_login_password').at(0);
    inputPassword.simulate('change', { target: { value: 'dummy' } });
    component.update();
    const button = component.find('.login-form-button').at(0);
    const spySignIn = jest.spyOn(actionCreators, 'signIn')
      .mockImplementation(() => {
        return (dispatch) => {};
      });
    button.simulate('click');
    expect(spySignIn).toHaveBeenCalled();
  });
});
