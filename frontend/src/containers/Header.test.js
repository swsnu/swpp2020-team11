import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Header from './Header';
import { history } from '../store/store';
import { getMockStore, stubInitialState } from '../test-utils/mocks';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';
import * as actionCreators from '../store/actions/account';

const stubAccount = {
  isLoggedIn: true,
  user: {
    id: 10,
  },
};

describe('<Header />', () => {
  let header;
  beforeEach(() => {
    header = function mockHeader(initialState) {
      const mockStore = getMockStore(initialState);
      return (
        <Provider store={ mockStore }>
          <ConnectedRouter history={ history }>
            <Header/>
          </ConnectedRouter>
        </Provider>
      );
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    const component = mount(header(stubInitialState));
    const wrapper = component.find('.Header');
    expect(wrapper.length).toBe(1);
    expect(component.find(LoginOutlined));
  });

  it('should redirect to main page if user click logo image', () => {
    const component = mount(header(stubInitialState));
    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation((path) => {
        return (dispatch) => {
        };
      });
    const signInButton = component.find('.LogoImage');
    signInButton.simulate('click');
    expect(spyHistory).toHaveBeenCalledTimes(1);
  });

  it('should redirect to sign in page if user click sign in button', () => {
    const component = mount(header(stubInitialState));
    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation((user) => {
        return (dispatch) => {
        };
      });
    const signInButton = component.find(LoginOutlined);
    signInButton.simulate('click');
    expect(spyHistory).toHaveBeenCalledTimes(1);
  });

  it('should show logout button if logged in', () => {
    const logInState = { ...stubInitialState, account: stubAccount };
    const component = mount(header(logInState));
    const wrapper = component.find('.Header');
    expect(wrapper.length).toBe(1);
    expect(component.find(UserOutlined));
  });

  it('should call signOut if user click logout button', () => {
    const logInState = { ...stubInitialState, account: stubAccount };
    const spyLogOut = jest.spyOn(actionCreators, 'signOut')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(header(logInState));
    const logoutButton = component.find(UserOutlined);
    logoutButton.simulate('click');
    expect(spyLogOut).toHaveBeenCalledTimes(1);
  });
});
