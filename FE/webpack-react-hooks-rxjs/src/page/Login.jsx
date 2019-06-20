import React, { Component } from 'react';
import {
    Redirect
} from 'react-router-dom';

class Login extends Component {
    constructor() {
        super();
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleLogin() {
        localStorage.setItem('login',true);
        this.setState({})
    }
    render() {
        if(localStorage.getItem('login')){
            return <Redirect to='/page1'/>
        }
        return <div className="Login" onClick={this.handleLogin}>
            Login
        </div>
    }
}

export default Login;