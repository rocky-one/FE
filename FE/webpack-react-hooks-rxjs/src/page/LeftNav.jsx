import React, { Component } from 'react';
import {
    Link,
    Redirect,
} from 'react-router-dom';

class LeftNav extends Component {
    constructor() {
        super();
        this.handleOut = this.handleOut.bind(this)
    }
    handleOut() {
        localStorage.removeItem('login', true);
        this.setState({})
    }
    render() {
        if(!localStorage.getItem('login')){
            return <Redirect to='/'/>
        }
        return <div>
            <ul>
                <li><Link to="/page1">page1</Link></li>
                <li><Link to="/page2">page2</Link></li>
                <li onClick={this.handleOut}>退出</li>
            </ul>
        </div>
    }
}

export default LeftNav;