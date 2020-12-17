import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store, persistor, history } from './store/store';
import 'antd/dist/antd.css';
import axios from 'axios';
import { PersistGate } from 'redux-persist/integration/react';

axios.defaults.baseURL = 'https://backend.asapgo.net/';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <PersistGate persistor={persistor}>
        <App history={ history }/>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
