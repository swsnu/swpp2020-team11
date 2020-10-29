import logo from './logo.svg';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import './App.css';

function App(props) {
  return (
    <ConnectedRouter history={props.history}>
      <div className="App">
        <Switch>
          <Route path='/' exact render={() => <div>main page</div>} />
        </Switch>
      </div>
    </ConnectedRouter>
    );
}

export default App;
