import React from 'react';
import { mount } from 'enzyme';
import HistoryItem from './HistoryItem';
import { history } from '../../store/store';
import { Router, Route, Switch } from 'react-router-dom';
const stubPlace = [{
  'id': 1, 'lat': 37, 'lng': 126, 'name': 'food',
  'img_urls': '../../assets/img/porto1.png', 'tag': 'temp',
}, {
  'id': 2, 'lat': 38, 'lng': 126, 'name': 'activity',
  'img_urls': '../../assets/img/porto1.png', 'tag': 'temp2',
}, {
  'id': 3, 'lat': 39, 'lng': 126, 'name': 'scenary',
  'img_urls': '../../assets/img/porto1.png', 'tag': 'temp3',
}];
const stubReview = [
  { 'id': 1, 'plan': 1, 'place': 1, 'score': 4.0, 'content': 'gd' },
  { 'id': 2, 'plan': 1, 'place': 2, 'score': 0.0, 'content': '\u314e\u3147' },
  { 'id': 3, 'plan': 1, 'place': 3, 'score': 3.0, 'content': '\u314e\u3147' },
];
const stubReview2 = [
  { 'id': 1, 'plan': 1, 'place': 1, 'score': 0.0, 'content': 'gd' },
  { 'id': 2, 'plan': 1, 'place': 2, 'score': 0.0, 'content': '\u314e\u3147' },
  { 'id': 3, 'plan': 1, 'place': 3, 'score': 0.0, 'content': '\u314e\u3147' },
];
describe('<HistoryItem/>', () => {
  let historyItem;
  let spyHistoryPush;
  beforeEach(() => {
    historyItem = function mockHistoryItem(reviews) {
      return (
        <Router history={history}>
          <Switch>
            <Route path='/' exact render={(props) => <HistoryItem {...props}
              plan={1} place={stubPlace} date='2020-11-10' review={reviews}/>}/>
          </Switch>
        </Router>
      );
    };
    spyHistoryPush = jest.spyOn(history, 'push')
      .mockImplementation((path) => {});
  });
  it('clik Modify', () => {
    const component = mount(historyItem(stubReview));
    const wrapper = component.find('Button');
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
  });
  it('clik Review', () => {
    const component = mount(historyItem([]));
    const wrapper = component.find('Button');
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledTimes(1);
  });
  it('score 0', () => {
    const component = mount(historyItem(stubReview2));
    const wrapper = component.find('.ant-rate-text');
    expect(wrapper.text()).toBe('terrible');
  });
});
