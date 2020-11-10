import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import PlanPage from './PlanPage';
import { history } from '../store/store';
import { getMockStore, stubInitialState, stubPlan, stubSinglePlan } from '../test-utils/mocks';
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
          <Route path='/' exact component={ PlanPage }/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<PlanPage />', () => {
  let component;

  beforeEach(() => {
    const stubNewPlan = { ...stubPlan, plan: stubSinglePlan };
    const stubNewState = { ...stubInitialState, plan: stubNewPlan };
    component = mount(mockMainPage(stubNewState));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error.', () => {
    expect(component.find('.plan-page').length).toBe(1);
    expect(component.find('img').length).toBe(3);
    expect(component.find('.tempting-phrase-wrapper').length).toBe(1);
    expect(component.find('button').length).toBe(1);
  });

  it('should call getPlan if logged in user click image.', () => {
    const button = component.find('button').at(0);
    const spyAction = jest.spyOn(actionCreators, 'makeReservation')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    button.simulate('click');
    expect(spyAction).toHaveBeenCalled();
  });
});
