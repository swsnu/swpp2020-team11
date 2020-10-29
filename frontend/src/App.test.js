import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { getMockStore } from './test-utils/mocks';
import { history } from './store/store';

const stubInitialState = {}

const mockStore = getMockStore(stubInitialState);


test('renders learn react link', () => {
  render(<Provider store={mockStore}>
    <App history={history}/>
  </Provider>)
});
