import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import accountReducer from './reducers/account';
import planReducer from './reducers/plan';
import suggestReducer from './reducers/suggest';
export const history = createBrowserHistory();
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['plan', 'suggest'],
};

const rootReducer = combineReducers({
  account: accountReducer,
  plan: planReducer,
  suggest: suggestReducer,
  router: connectRouter(history),
});

export default persistReducer(persistConfig, rootReducer);
