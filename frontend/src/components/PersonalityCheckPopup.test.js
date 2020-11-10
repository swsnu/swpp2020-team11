import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../store/store';
import { getMockStore, stubInitialState } from '../test-utils/mocks';
import { Popconfirm, Button } from 'antd';

import PersonalityCheckPopup from './PersonalityCheckPopup';

describe('<PersonalityCheckPopup />', () => {
  let popup;

  beforeEach(() => {
    popup = function mockPopup(initialState) {
      const mockStore = getMockStore(initialState);
      return (
        <Provider store={ mockStore }>
          <ConnectedRouter history={ history }>
            <PersonalityCheckPopup />
          </ConnectedRouter>
        </Provider>
      );
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    const component = mount(popup(stubInitialState));
    expect(component.find('.PersonalityCheckPopup').length).toBe(1);
    expect(component.find(Popconfirm).length).toBe(1);
    expect(component.find(Button).length).toBe(1);
  });

  // it('should go back to mainpage when pressed cancel', () => {
  //   const component = mount(popup(stubInitialState));
  //   const wrapper = component.find('PersonalityCheckPopup').instance();
  //   const spyHistory = jest.spyOn(history, 'push')
  //     .mockImplementation((user) => {
  //       return (dispatch) => {
  //       };
  //     });
  //   wrapper.setState({ visible: true });
  //   component.update();
  //   component.find(Popconfirm).simulate('cancel');
  //   expect(spyHistory).toHaveBeenCalledTimes(1);
  // });

  it('should be seen when pressed button', () => {
    const component = mount(popup(stubInitialState));
    component.find(Button).simulate('click');
    const wrapper = component.find('PersonalityCheckPopup').instance();
    expect(wrapper.state.visible).toBe(true);
  });

  // it('1111should be seen when pressed button', () => {
  //   const component = mount(popup(stubInitialState));
  //   expect(component.find('.ant-popover-open').length).toBe(100);
  //   const wrapper = component.find('PersonalityCheckPopup').instance();
  //   expect(wrapper.state.visible).toBe(true);
  // });
});
