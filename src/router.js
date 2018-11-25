import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import HomePage from './routes/Login/index'
import Manage from './routes/Manage/Manage'

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/manage" component={Manage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
