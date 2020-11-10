import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import Main from './containers/MainPage';
import Header from './containers/Header';
import PlanReservation from './containers/PlanReservation';
import './App.css';

function App(props) {
  return (
    <ConnectedRouter history={ props.history }>
      <div className='App'>
        <Header/>
        <Switch>
          <Route path='/' exact component={ Main }/>
          <Route path='/plan/reservation/' exact component={ PlanReservation }/>
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default App;
