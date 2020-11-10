import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import Main from './containers/MainPage';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import Header from './containers/Header';
import './App.css';

function App(props) {
  return (
    <ConnectedRouter history={ props.history }>
      <div className='App'>
        <Header/>
        <Switch>
          <Route path='/' exact component={ Main }/>
          <Route path='/sign_in/' exact component={ SignIn }/>
          <Route path='/sign_up/' exact component={ SignUp }/>
          {/* <Route path='/plan/' exact render={() => <div>plan page</div>}/> */}
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default App;
