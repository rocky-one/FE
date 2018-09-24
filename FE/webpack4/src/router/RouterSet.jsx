import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'

class RouterSet extends Component {
    constructor() {
        super();
    }
    render() {
        const { component: Component } = this.props;
        const login = localStorage.getItem('login');
        return (
          <Route render={props => {
            return login
              ? <Component {...props} />
              : <Redirect to="/" />
          }} />
        )
      }
}
export default RouterSet;