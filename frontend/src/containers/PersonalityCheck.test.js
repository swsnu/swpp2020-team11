import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import PersonalityCheck from './PersonalityCheck';
import { history } from '../store/store';
import { getMockStore, stubInitialState } from '../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';


const mockStore = getMockStore(stubInitialState);

jest.mock('../components/PersonalityQuestion', () => {
  return function mockQuestion({ key, question }) {
    return (<div key={ key } className="spyQuestion">{ question }</div>);
  };
});

const mockComponent = (
  <Provider store={ mockStore }>
    <ConnectedRouter history={ history }>
      <Switch>
        <Route path='/' exact component={ PersonalityCheck }/>
      </Switch>
    </ConnectedRouter>
  </Provider>
);

const stubQuestionResponse = {
  questions: [
    { id: 1, question: 'question1' },
    { id: 2, question: 'question2' },
    { id: 3, question: 'question3' },
    { id: 4, question: 'question4' },
    { id: 5, question: 'question5' },
    { id: 6, question: 'question6' },
    { id: 7, question: 'question7' },
    { id: 8, question: 'question8' },
    { id: 9, question: 'question9' },
    { id: 10, question: 'question10' },
    { id: 11, question: 'question11' },
    { id: 12, question: 'question12' },
  ],
};


describe('<PersonalityCheck /> componentDidMount', () => {
  let spyGet;

  beforeEach(() => {
    jest.spyOn(console, 'log')
      .mockImplementation((url) => {
      });
    spyGet = jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 400,
            data: null,
          };
          reject(result);
        });
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log if response is not valid.', () => {
    const component = mount(mockComponent);
    const wrapper = component.find('PersonalityCheck').instance();
    component.update();
    expect(spyGet).toHaveBeenCalledWith('api/user/personality_check/');
    expect(component.find('.spyQuestion')).toHaveLength(0);
    expect(component.find('.personality-check-page')).toHaveLength(1);
    expect(wrapper.state.questions).toStrictEqual([]);
    expect(wrapper.state.maxPage).toBe(1);
  });
});


describe('<PersonalityCheck /> render', () => {
  let component;
  let wrapper;

  beforeEach(() => {
    jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubQuestionResponse,
          };
          resolve(result);
        });
      });
    component = mount(mockComponent);
    wrapper = component.find('PersonalityCheck').instance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error.', () => {
    component.update();
    expect(component.find('.spyQuestion')).toHaveLength(5);
    expect(component.find('.personality-check-page')).toHaveLength(1);
    expect(wrapper.state.questions).toStrictEqual(stubQuestionResponse.questions);
    expect(wrapper.state.maxPage).toBe(3);
  });

  it('should show button properly.', () => {
    component.update();
    expect(component.find('.next-button button')).toHaveLength(1);
    expect(component.find('.prev-button button')).toHaveLength(0);
    expect(component.find('.submit-button button')).toHaveLength(0);
    const wrapper = component.find('PersonalityCheck').instance();
    wrapper.setState({ page: 3 });
    component.update();
    expect(component.find('.next-button button')).toHaveLength(0);
    expect(component.find('.prev-button button')).toHaveLength(1);
    expect(component.find('.submit-button button')).toHaveLength(1);
  });

  it('should change page if user click next or prev button.', () => {
    const wrapper = component.find('PersonalityCheck').instance();
    component.update();
    const nextButton = component.find('.next-button button');
    nextButton.simulate('click');
    expect(wrapper.state.page).toBe(2);
    component.update();
    const prevButton = component.find('.prev-button button');
    prevButton.simulate('click');
    expect(wrapper.state.page).toBe(1);
  });

  it('should show modal if user click submit button.', () => {
    const wrapper = component.find('PersonalityCheck').instance();
    wrapper.setState({ page: 3 });
    component.update();
    const submitButton = component.find('.submit-button button');
    submitButton.simulate('click');
    component.update();
    expect(wrapper.state.popUpVisible).toBeTruthy();
  });
});

describe('<PersonalityCheck /> modal', () => {
  let component;
  let wrapper;

  beforeEach(() => {
    jest.spyOn(console, 'log')
      .mockImplementation((url) => {
      });
    jest.spyOn(axios, 'get')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
            data: stubQuestionResponse,
          };
          resolve(result);
        });
      });
    component = mount(mockComponent);
    wrapper = component.find('PersonalityCheck').instance();
    wrapper.setState({ popUpVisible: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should close modal if user click close button.', () => {
    component.update();
    const closeButton = component.find('Modal button').at(0);
    closeButton.simulate('click');
    expect(wrapper.state.popUpVisible).toBeFalsy();
  });

  it('should close modal if user click cancel button.', () => {
    component.update();
    const cancelButton = component.find('Modal button').at(1);
    cancelButton.simulate('click');
    expect(wrapper.state.popUpVisible).toBeFalsy();
  });

  it('should post to backend if user click okay button.', () => {
    const spyPost = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
          };
          resolve(result);
        });
      });
    component.update();
    const cancelButton = component.find('Modal button').at(2);
    cancelButton.simulate('click');
    expect(spyPost).toHaveBeenCalledWith('api/user/personality_check/', {});
  });

  it('should log if response is not valid.', () => {
    const spyPost = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        return new Promise((resolve, reject) => {
          const result = {
            status: 200,
          };
          reject(result);
        });
      });
    component.update();
    const cancelButton = component.find('Modal button').at(2);
    cancelButton.simulate('click');
    expect(spyPost).toHaveBeenCalledWith('api/user/personality_check/', {});
  });
});
