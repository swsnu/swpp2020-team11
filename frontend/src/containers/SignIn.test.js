import React from 'react';
import { Provider } from 'react-redux';
import { Form, Input, Button, Checkbox } from 'antd';
import SignIn from './SignIn';
import { mount } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../store/store';
import { getMockStore, stubInitialState } from '../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';

function mockSignIn(initialState) {
  const mockStore = getMockStore(initialState);
  return (
    <Provider store={ mockStore }>
      <ConnectedRouter history={ history }>
        <Switch>
          <Route path='/sign_in/' exact component={ SignIn }/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<SignIn />', () => {
  let signIn;

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
    expect(component.find(Form).length).toBe(1);
    expect(component.find(Form.Item).length).toBe(4);
    expect(component.find(Input).length).toBe(2);
    expect(component.find(Button).length).toBe(1);
    expect(component.find(Checkbox).length).toBe(1);
  });
});
