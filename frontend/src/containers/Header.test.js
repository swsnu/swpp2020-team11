import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Header from './Header';
import { history } from '../store/store';
import { getMockStore, stubInitialState, stubAccount } from '../test-utils/mocks';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';
import * as actionCreators from '../store/actions/account';


describe('<Header />', () => {
  let header;
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
    jest.spyOn(actionCreators, 'checkAccount')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
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
    const wrapper = component.find('.logoImage img');
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
    const signInButton = component.find('.logoImage img');
    signInButton.simulate('click');
    expect(spyHistory).toBeCalledWith('/');
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

  it('should show user menu button if logged in', () => {
    const logInState = { ...stubInitialState, account: stubAccount };
    const component = mount(header(logInState));
    const wrapper = component.find('.logoImage img');
    expect(wrapper.length).toBe(1);
    expect(component.find(UserOutlined));
  });
});
