import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import './App.css';

/**
 * Render a <App /> component
 * @component
 * @param {object} props
 * @param {history} props.history
 * @return {object}
 */
function App(props) {
  return (
    <ConnectedRouter history={props.history}>
      <div className="App">
        <Switch>
          <Route path='/' exact render={() => <div>asapgo</div>}/>
        </Switch>
      </div>
    </ConnectedRouter>
  );
}

App.propTypes = {
  history: PropTypes.object.isRequired,
};

export default App;
