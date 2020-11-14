import React from 'react';
import { mount } from 'enzyme';
import PersonalityQuestion from './PersonalityQuestion';
import { history } from '../store/store';
import { getMockStore, stubInitialState } from '../test-utils/mocks';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import * as actionCreators from '../store/actions/account';

const mockStore = getMockStore(stubInitialState);

describe('<PersonalityQuestion />', () => {
  let personalityQuestion;
  beforeEach(() => {
    personalityQuestion = (
      <Provider store={ mockStore }>
        <ConnectedRouter history={ history }>
          <PersonalityQuestion idx={ 1 } question={ 'question1' }/>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should render without errors', () => {
    const component = mount(personalityQuestion);
    expect(component.find('.question-item')).toHaveLength(1);
    expect(component.find('.ant-radio-button-wrapper')).toHaveLength(5);
  });

  it('should call something', () => {
    const spySetPersonality = jest.spyOn(actionCreators, 'setPersonality')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(personalityQuestion);
    const wrapper = component.find('PersonalityQuestion').instance();
    wrapper.onChange({ target: { value: 5 } });
    // i can't find a way to trigger radio change directly
    expect(spySetPersonality).toHaveBeenCalledWith(1, 5);
  });
});
