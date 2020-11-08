import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import MainPage from './MainPage';
import { history } from '../store/store';
import { getMockStore, stubInitialState } from '../test-utils/mocks';
import { Typography, InputNumber } from 'antd';
import { Route, Switch } from 'react-router-dom';
import * as actionCreators from '../store/actions/plan';

const { Paragraph } = Typography;

describe('<MainPage />', () => {
  let mainPage;

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
    mainPage = function mockMainPage(initialState) {
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
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    const component = mount(mainPage(stubInitialState));
    expect(component.find('.MainPage').length).toBe(1);
    expect(component.find('img').length).toBe(3);
    expect(component.find(Paragraph).length).toBe(3);
    expect(component.find(InputNumber).length).toBe(1);
  });

  it('should call get plan when click image.', () => {
    const component = mount(mainPage(stubInitialState));
    const spyFunction = jest.spyOn(actionCreators, 'getPlan')
      .mockImplementation((path) => {
        return (dispatch) => {
        };
      });
    const image = component.find('img').at(0);
    image.simulate('click');
    expect(spyFunction).toHaveBeenCalledTimes(1);
  });

  it('should save headcount if user set head count.', () => {
    const component = mount(mainPage(stubInitialState));
    const inputNumber = component.find('input').at(0);
    console.log(inputNumber.instance());
    const wrapper = component.find('MainPage').instance();
    inputNumber.simulate('change', { target: { value: '3' } });
    expect(wrapper.state.headCount).toBe(3);
  });
});
