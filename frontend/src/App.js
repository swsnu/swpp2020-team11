import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import Main from './containers/MainPage';
import PlanPage from './containers/PlanPage';
import Header from './containers/Header';
import './App.css';

function App(props) {
  return (
    <ConnectedRouter history={ props.history }>
      <div className='App'>
        <Header/>
        <Switch>
          <Route path='/' exact component={ Main }/>
          <Route path='/plan' exact component={ PlanPage }/>
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default App;
