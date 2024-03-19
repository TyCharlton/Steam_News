// App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Header from './Header';
import CreateAccount from './CreateAccount';
import Login from './Login';
import Settings from './Settings';
import SteamNews from './SteamNews';

function App() {
  return (
    <div className="app_div">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/news" component={SteamNews} />
          <Route path="/createaccount" component={CreateAccount} />
          <Route path="/login" component={Login} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
