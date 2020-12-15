import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import Main from './containers/MainPage';
import PlanPage from './containers/PlanPage';
import SignIn from './containers/SignIn';
import PersonalityCheck from './containers/PersonalityCheck';
import SignUp from './containers/SignUp';
import Header from './containers/Header';
import PlanReservation from './containers/PlanReservation';
import History from './containers/History';
import ReviewCreate from './components/review/ReviewCreate';
import ReviewEdit from './components/review/ReviewEdit';
import Suggestion from './containers/Suggestion';
import SuggestionCreate from './containers/SuggestionCreate';
import './App.css';

function App(props) {
  return (
    <ConnectedRouter history={ props.history }>
      <div className='App'>
        <Header/>
        <Switch>
          <Route path='/' exact component={ Main }/>
          <Route path='/plan/reservation' exact component={ PlanReservation }/>
          <Route path='/plan' exact component={ PlanPage }/>
          <Route path='/sign_in' exact component={ SignIn }/>
          <Route path='/personality_check' exact component={ PersonalityCheck }/>
          <Route path='/sign_up' exact component={ SignUp }/>
          <Route path='/plan/history' exact component={ History }/>
          <Route path='/review/:id/edit' exact component={ ReviewEdit }/>
          <Route path='/review/:id/create' exact component={ ReviewCreate }/>
          <Route path='/suggest' exact component={ Suggestion }/>
          <Route path='/suggest/create' exact component={ SuggestionCreate }/>
          <Route path='/suggest/:id/edit' exact component={ SuggestionCreate }/>
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default App;
