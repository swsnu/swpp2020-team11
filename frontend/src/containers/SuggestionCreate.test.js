import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { history } from '../store/store';
import {
  getMockStore,
  stubInitialState,
  stubSuggestDetail,
  stubInitialSuggestDetail,
  initialSuggestDetail,
} from '../test-utils/mocks';
import SuggestionCreate from './SuggestionCreate';
import * as actionCreators from '../store/actions/suggest';
import axios from 'axios';

jest.mock('react-daum-postcode', () => {
  return function mockDaum({ onComplete }) {
    const data = {
      roadAddress: 'test',
    };
    return (<div key='1' className='spy-daum-post'>
      <button className='spy-daum-post-complete-button' onClick={ () => onComplete(data) }/>
    </div>);
  };
});

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  const Upload = ({ customRequest, onPreview, onChange }) => {
    return <div className='spy-upload'>
      <button className="spy-onchange" onChange={ (e) => onChange(e) }/>
      <button className="spy-custom-request" onChange={ (e) => customRequest(e) }/>
      <button className="spy-onpreview" onChange={ (e) => onPreview(e) }/>
    </div>;
  };

  return {
    ...antd,
    Upload,
  };
});

jest.mock('react-geocode', () => {
  return jest.fn().mockImplementation(() => ({
    setApiKey: jest.fn(),
    fromAddress: jest.fn().mockImplementation(() => {
      return (data) => new Promise((resolve, reject) => {
        const result = {
          status: 200,
          results: [
            {
              geometry: {
                location: {},
              },
            },
          ],
        };
        resolve(result);
      });
    })(),
  }))();
});

describe('<SuggestionCreate/>', () => {
  let suggestion;
  beforeEach(() => {
    suggestion = function mockHistory(initialState) {
      const stubSuggest = { ...stubInitialState.suggest, suggestDetail: initialState };
      const stubSuggestDetailState = { ...stubInitialState, suggest: stubSuggest };
      const mockStore = getMockStore(stubSuggestDetailState);
      return (
        <Provider store={ mockStore }>
          <ConnectedRouter history={ history }>
            <Switch>
              <Route path='/' exact component={ SuggestionCreate }/>
            </Switch>
          </ConnectedRouter>
        </Provider>
      );
    };

    jest.spyOn(console, 'log')
      .mockImplementation((data) => {
        return (dispatch) => {
        };
      });

    jest.spyOn(history, 'push')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Suggestion without error', () => {
    const component = mount(suggestion(stubInitialSuggestDetail));
    expect(component.find('.road-address input')).toHaveLength(1);
    expect(component.find('.extra-address input')).toHaveLength(1);
    expect(component.find('.name input')).toHaveLength(1);
    expect(component.find('.tags input')).toHaveLength(1);
    expect(component.find('.explanation textarea')).toHaveLength(1);
  });

  it('should render Suggestion without error', () => {
    const component = mount(suggestion(stubSuggestDetail));
    expect(component.find('.road-address input')).toHaveLength(1);
    expect(component.find('.extra-address input')).toHaveLength(1);
    expect(component.find('.name input')).toHaveLength(1);
    expect(component.find('.tags input')).toHaveLength(1);
    expect(component.find('.explanation textarea')).toHaveLength(1);
    const wrapper = component.find('SuggestionCreate').instance();
    expect(wrapper.state.isAddressSet).toBeTruthy();
    expect(wrapper.state.addressValidateState).toBeTruthy();
  });

  it('should change content of extra address if user type', () => {
    const spyChangeSuggestionDetail = jest.spyOn(actionCreators, 'changeSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(suggestion(stubInitialSuggestDetail));
    const input = component.find('.extra-address input');
    input.simulate('change', { target: { value: 'test' } });
    expect(spyChangeSuggestionDetail).toHaveBeenCalledWith('extraAddress', 'test');
  });

  it('should change content of name if user type', () => {
    const spyChangeSuggestionDetail = jest.spyOn(actionCreators, 'changeSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(suggestion(stubInitialSuggestDetail));
    const input = component.find('.name input');
    input.simulate('change', { target: { value: 'test' } });
    expect(spyChangeSuggestionDetail).toHaveBeenCalledWith('name', 'test');
  });

  it('should change content of explanation if user type', () => {
    const spyChangeSuggestionDetail = jest.spyOn(actionCreators, 'changeSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(suggestion(stubInitialState));
    const input = component.find('.explanation textarea');
    input.simulate('change', { target: { value: 'test' } });
    expect(spyChangeSuggestionDetail).toHaveBeenCalledWith('explanation', 'test');
  });

  it('should change content of tags if user type', () => {
    const spyChangeSuggestionDetail = jest.spyOn(actionCreators, 'changeSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(suggestion(stubInitialState));
    const input = component.find('.tags input');
    input.simulate('change', { target: { value: 'test' } });
    expect(spyChangeSuggestionDetail).toHaveBeenCalledWith('tags', 'test');
  });

  it('should change content of tags if user type', () => {
    const spyChangeSuggestionDetail = jest.spyOn(actionCreators, 'changeSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(suggestion(stubInitialState));
    const input = component.find('.tags input');
    input.simulate('change', { target: { value: 'test' } });
    expect(spyChangeSuggestionDetail).toHaveBeenCalledWith('tags', 'test');
  });

  it('should call put suggest detail if click submit button and this is modify phase', () => {
    const spyPutSuggestionDetail = jest.spyOn(actionCreators, 'putSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(suggestion(stubSuggestDetail));
    const input = component.find('.create-form-button button');
    input.simulate('click');
    expect(spyPutSuggestionDetail).toHaveBeenCalled();
  });

  it('should not call create suggest detail if image not setted', () => {
    const component = mount(suggestion(initialSuggestDetail));
    const input = component.find('.create-form-button button');
    input.simulate('click');
  });

  it('should not call create suggest detail if image not setted', () => {
    const component = mount(suggestion(initialSuggestDetail));
    const wrapper = component.find('SuggestionCreate').instance();
    wrapper.setState({ fileList: [{ 'status': 'done' }] });
    component.update();
    const input = component.find('.create-form-button button');
    input.simulate('click');
  });


  it('should call create suggest detail if click submit button and this is create phase', () => {
    const spyCreateSuggestionDetail = jest.spyOn(actionCreators, 'createSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(suggestion({ ...stubSuggestDetail, id: undefined }));
    const input = component.find('.create-form-button button');
    input.simulate('click');
    expect(spyCreateSuggestionDetail).toHaveBeenCalled();
  });

  it('should show modal if click road address button', () => {
    const component = mount(suggestion(stubInitialState));
    const input = component.find('.road-address-button button');
    input.simulate('click');
    component.update();
    const wrapper = component.find('SuggestionCreate').instance();
    expect(wrapper.state.isModalVisible).toBeTruthy();
    expect(component.find('.spy-daum-post')).toHaveLength(1);
  });

  it('should show modal if click road address button', () => {
    const spyChangeSuggestionDetaill = jest.spyOn(actionCreators, 'changeSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });
    const component = mount(suggestion(stubInitialState));
    const wrapper = component.find('SuggestionCreate').instance();
    wrapper.setState({ isModalVisible: true });
    component.update();
    const input = component.find('.spy-daum-post-complete-button');
    input.simulate('click');
    expect(spyChangeSuggestionDetaill).toHaveBeenCalledTimes(0);
  });

  it('should close modal if click close button', () => {
    const component = mount(suggestion(stubInitialState));
    const wrapper = component.find('SuggestionCreate').instance();
    wrapper.setState({ isModalVisible: true });
    component.update();
    const input = component.find('.road-address-modal button').at(0);
    input.simulate('click');
    expect(wrapper.state.isModalVisible).toBeFalsy();
  });

  it('should close modal if click close button', () => {
    const component = mount(suggestion(stubInitialState));
    const wrapper = component.find('SuggestionCreate').instance();
    wrapper.setState({ previewVisible: true });
    component.update();
    const input = component.find('.preview-image-modal button').at(0);
    input.simulate('click');
    expect(wrapper.state.previewVisible).toBeFalsy();
  });

  it('should not upload image if image size is over 500000', () => {
    const component = mount(suggestion(stubInitialState));
    const input = component.find('.spy-custom-request');
    const data = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
      file: {
        'name': 'test',
        'size': 1000000,
      },
    };
    input.simulate('change', data);
  });

  it('should not upload image if image name is not valld', () => {
    const component = mount(suggestion(stubInitialState));
    const input = component.find('.spy-custom-request');
    const data = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
      file: {
        'name': 'test',
        'size': 1000,
      },
    };
    input.simulate('change', data);
  });
  it('should not upload image if backend didn\'t send presigned url', () => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url, data) => {
        return new Promise((resolve, reject) => {
          const data = { fields: { 'key': 'image_key.jpg' }, url: 'test.com' };
          const result = {
            status: 400,
            data: data,
          };
          reject(result);
        });
      });

    const component = mount(suggestion(stubInitialState));
    const input = component.find('.spy-custom-request');
    const data = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
      file: {
        'name': 'test.jpg',
        'size': 1000,
      },
    };
    input.simulate('change', data);
    expect(spyAxios).toHaveBeenCalledTimes(1);
  });

  it('should not upload image if s3 has an error', () => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url, data) => {
        if (url === '/api/suggest/image_upload_presigned_url/') {
          return new Promise((resolve, reject) => {
            const data = { fields: { 'key': 'image_key.jpg' }, url: 'test.com' };
            const result = {
              status: 200,
              data: data,
            };
            resolve(result);
          });
        } else {
          return new Promise((resolve, reject) => {
            const result = {
              status: 200,
            };
            reject(result);
          });
        }
      });

    const component = mount(suggestion(stubInitialState));
    const input = component.find('.spy-custom-request');
    const data = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
      file: {
        'name': 'test.jpg',
        'size': 1000,
      },
    };
    input.simulate('change', data);
    expect(spyAxios).toHaveBeenCalled();
  });

  it('should upload image if every conditions are valid', () => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        if (url === '/api/suggest/image_upload_presigned_url/') {
          return new Promise((resolve, reject) => {
            const data = { fields: { 'key': 'image_key.jpg' }, url: 'test.com' };
            const result = {
              status: 200,
              data: data,
            };
            resolve(result);
          });
        } else {
          return new Promise((resolve, reject) => {
            const result = {
              status: 200,
            };
            resolve(result);
          });
        }
      });

    jest.spyOn(actionCreators, 'changeSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });

    const component = mount(suggestion(stubInitialState));
    const input = component.find('.spy-custom-request');
    const data = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
      file: {
        'name': 'test.jpg',
        'size': 1000,
      },
    };
    input.simulate('change', data);
    expect(spyAxios).toHaveBeenCalled();
  });


  it('should upload image if every conditions are valid', () => {
    const spyAxios = jest.spyOn(axios, 'post')
      .mockImplementation((url) => {
        if (url === '/api/suggest/image_upload_presigned_url/') {
          return new Promise((resolve, reject) => {
            const data = { fields: { 'key': 'image_key.jpg' }, url: 'test.com' };
            const result = {
              status: 200,
              data: data,
            };
            resolve(result);
          });
        } else {
          return new Promise((resolve, reject) => {
            const result = {
              status: 200,
            };
            resolve(result);
          });
        }
      });

    jest.spyOn(actionCreators, 'changeSuggestionDetail')
      .mockImplementation(() => {
        return (dispatch) => {
        };
      });

    const component = mount(suggestion(stubInitialState));
    const input = component.find('.spy-custom-request');
    const data = {
      onSuccess: jest.fn(),
      onError: jest.fn(),
      file: {
        'name': 'test.jpg',
        'size': 1000,
      },
    };
    input.simulate('change', data);
    expect(spyAxios).toHaveBeenCalled();
  });


  it('should change state if image is changed', () => {
    const component = mount(suggestion(stubInitialState));
    const input = component.find('.spy-onpreview');

    const file = {
      url: '',
      preview: '',
      origineFileObj: '',
    };

    input.simulate('change', file);
  });

  it('should change state if image is changed', () => {
    const component = mount(suggestion(stubInitialState));
    const input = component.find('.spy-onpreview');

    const file = {
      url: 'test.com',
      preview: '',
      origineFileObj: '',
    };

    input.simulate('change', file);
  });

  it('should change file if image is changed', () => {
    const component = mount(suggestion(stubInitialState));
    const input = component.find('.spy-onchange');
    input.simulate('change', { fileList: [] });
  });
});

