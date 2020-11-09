import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import Main from './containers/MainPage';
import Header from './containers/Header';
import History from './containers/History';
import ReviewCreate from './components/review/ReviewCreate';
import ReviewEdit from './components/review/ReviewEdit';
import './App.css';

function App(props) {
  return (
    <ConnectedRouter history={ props.history }>
      <div className='App'>
        <Header/>
        <Switch>
          <Route path='/' exact component={ Main }/>
          <Route path='/sign_in/' exact component={ SignIn }/>
          <Route path='/plan/' exact render={() => <div>plan page</div>}/>
          <Route path='/plan/history' exact component={ History }/>
          <Route path='/review/:id/edit' exact component={ReviewEdit}/>
          <Route path='/review/:id/create' exact component={ ReviewCreate }/>
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

export default App;
