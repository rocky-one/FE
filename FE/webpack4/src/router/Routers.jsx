import React, { Component } from 'react';
import {
    HashRouter as Router,
    Route,
    Switch,
    Link,
} from 'react-router-dom';
import asyncComponent from '../components/AsyncComponent';
import LeftNav from '../page/LeftNav';
const Page1 = asyncComponent(() => import(/* webpackChunkName: "Page1" */ "../page/Page1"));
const Page2 = asyncComponent(() => import(/* webpackChunkName: "Page2" */ "../page/Page2"));


const Routers = (props) => ({ match }) => {

    return <div>
        <LeftNav />
        <Switch>
            <Route path="/page1" component={Page1} />
            <Route path="/page2" component={Page2} />
        </Switch>
    </div>


}
export default Routers;