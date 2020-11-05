import React from 'react';
import App from './App';
import { shallow } from 'enzyme';


describe('<App />', () => {
  it('renders without crashing', () => {
    const component = shallow(<App/>);
    const wrapper = component.find('.App');
    expect(wrapper.find('.App')).toHaveLength(1);
  });
});
test('renders learn react link', () => {
});
