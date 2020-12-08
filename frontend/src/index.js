import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store, { history } from './store/store';
import axios from 'axios';
import 'antd/dist/antd.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <App history={ history }/>
    </Provider>
    <meta name="referrer" content="no-referrer-when-downgrade" />
  </React.StrictMode>,
  document.getElementById('root'),
);

// axios.defaults.baseURL = 'https://localhost:8000';

axios.defaults.baseURL = 'http://asapgo-backend.eba-qae3isys.ap-northeast-2.elasticbeanstalk.com';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
