import React, { Component } from 'react';
import {
    HashRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import Login from '../page/Login';
import RouterSet from './RouterSet';
import Routers from './Routers';

class RouterRoot extends Component {
    constructor() {
        super();
    }
    render() {
        return <Router>
            <Switch>
                <Route exact path="/" component={Login} />
                <RouterSet component={Routers(this.props)}/>
            </Switch>
        </Router>
    }
}
export default RouterRoot;