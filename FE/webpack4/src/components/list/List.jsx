import React, { Component } from 'react';
import { handleList } from './utils';
import listStyle from './list.css';
import listStyle2 from './list2.less';
import { Button } from 'antd';

class List extends Component {
    constructor() {
        super();
        handleList();
    }

    render() {
        return <div className={`${listStyle.list} ${listStyle2.list2}`}>
            List
            <div className={listStyle2.listChild}></div>
            <Button>按钮s</Button>
        </div>
    }
}

export default List;