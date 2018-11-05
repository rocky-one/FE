import React, { Component } from 'react';
import { handleList } from './utils';
import './list.css';
import { Button } from 'antd';

class List extends Component {
    constructor() {
        super();
        handleList();
    }
    componentDidMount() {
        $('.list').addClass('news')
    }
    render() {
        return <div className="list">
            List
            <Button>按钮s</Button>
        </div>
    }
}

export default List;