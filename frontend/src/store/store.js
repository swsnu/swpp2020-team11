import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import rootReducer from './root-reducer';
import { persistStore } from 'redux-persist';
export const history = createBrowserHistory();

export const middlewares = [thunk, routerMiddleware(history)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer,
  composeEnhancers(
    applyMiddleware(...middlewares)));

export const persistor = persistStore(store);

export default { store, persistor };
