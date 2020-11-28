import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import PlanReservation from './PlanReservation';
import { history } from '../store/store';
import {
  getMockStore, stubInitialState,
  stubPlan, stubReservation,
} from '../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';

function mockReservationPage(initialState) {
  const mockStore = getMockStore(initialState);
  return (
    <Provider store={ mockStore }>
      <ConnectedRouter history={ history }>
        <Switch>
          <Route path='/' exact component={ PlanReservation }/>
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

describe('<PlanReservation />', () => {
  let component;

  beforeEach(() => {
    const stubNewPlan = { ...stubPlan, reservation: { taxi: stubReservation } };
    const stubNewState = { ...stubInitialState, plan: stubNewPlan };
    component = mount(mockReservationPage(stubNewState));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error.', () => {
    expect(component.find('.PlanReservation')).toHaveLength(1);
    expect(component.find('.TaxiImage img')).toHaveLength(1);
    expect(component.find('.GoogleAPI img')).toHaveLength(1);
    expect(component.find('.TaxiInfo')).toHaveLength(1);
    expect(component.find('button')).toHaveLength(1);
  });
  it('should redirect to main page if user click button.', () => {
    const button = component.find('button').at(0);
    const spyHistory = jest.spyOn(history, 'push')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    button.simulate('click');
    expect(spyHistory).toHaveBeenCalledWith('/');
  });
});
