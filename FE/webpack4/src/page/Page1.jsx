import React, { Component } from 'react';
import List from '../components/list/List';

class Page1 extends Component {
    constructor() {
        super();
    }

    render() {
        return <div className="Page1">
            Page1
            <List />
        </div>
    }
}

export default Page1;