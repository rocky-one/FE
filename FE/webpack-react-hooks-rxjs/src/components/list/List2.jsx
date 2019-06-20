import React, { Component } from 'react';
import { handleList } from './utils';

class List2 extends Component {
    constructor() {
        super()
        handleList();
    }

    render() {
        return <div className="List2">
            List2
        </div>
    }
}

export default List2;