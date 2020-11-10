import React from 'react';
import { mount } from 'enzyme';
import UserMenu from './Menu';
import { history } from '../store/store';
import { getMockStore, stubInitialState } from '../test-utils/mocks';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import * as actionCreators from '../store/actions/account';

const mockStore = getMockStore(stubInitialState);

describe('<UserMenu />', () => {
  let userMenu;
  beforeEach(() => {
    userMenu = (
      <Provider store={ mockStore }>
        <ConnectedRouter history={ history }>
          <UserMenu/>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should render without errors', () => {
    const component = mount(userMenu);
    const buttonWrapper = component.find('.user-menu-button button');
    expect(buttonWrapper.length).toBe(4);
  });

  it('should redirect to history page if user click history', () => {
    const component = mount(userMenu);
    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation((path) => {
        return (dispatch) => {
        };
      });
    const userMenuButton = component.find('.user-menu-button button').at(0);
    userMenuButton.simulate('click');
    expect(spyHistory).toHaveBeenCalledWith('/plan/history');
  });

  it('should redirect to personality check page if user click person', () => {
    const component = mount(userMenu);
    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation((path) => {
        return (dispatch) => {
        };
      });
    const userMenuButton = component.find('.user-menu-button button').at(1);
    userMenuButton.simulate('click');
    expect(spyHistory).toBeCalledWith('/personality_check');
  });
  it('should redirect to suggest place page if user click suggest place button', () => {
    const component = mount(userMenu);
    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation((path) => {
        return (dispatch) => {
        };
      });
    const userMenuButton = component.find('.user-menu-button button').at(2);
    userMenuButton.simulate('click');
    expect(spyHistory).toBeCalledWith('/suggest');
  });
  it('should logout function if user click logout button', () => {
    const component = mount(userMenu);
    const spyOn = jest.spyOn(actionCreators, 'signOut')
      .mockImplementation((user) => {
        return (dispatch) => {
        };
      });
    const userMenuButton = component.find('.user-menu-button button').at(3);
    userMenuButton.simulate('click');
    expect(spyOn).toHaveBeenCalledTimes(1);
  });
});
