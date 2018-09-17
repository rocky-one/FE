import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    observer,
    inject,
} from 'mobx-react';
import { AppState } from '../../store/appStore';

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
    appStore: PropTypes.instanceOf(AppState).isRequired,
}
