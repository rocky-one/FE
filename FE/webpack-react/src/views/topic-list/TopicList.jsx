import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    observer,
    inject,
} from 'mobx-react';
// import { AppStore } from '../../store/store';

@inject('appStore') @observer
class TopicList extends Component {
    componentDidMount() {

    }

    onChange = (event) => {
        const {
            appStore,
        } = this.props;
        appStore.changeName(event.target.value);
    }

    asyncBootstrap() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const {
                    appStore,
                } = this.props;
                appStore.count = 3;
                resolve(true)
            }, 1000);
        })
    }

    render() {
        const {
            appStore,
        } = this.props;
        return (
            <div>
                <input onChange={this.onChange} />
                {appStore.msg}
            </div>
        );
    }
}
export default TopicList;

TopicList.propTypes = {
    appStore: PropTypes.any,// eslint-disable-line
}
