import React, { Component } from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            a: 1,
        }
    }

    render() {
        const {
            a
        } = this.state;
        return (
            <div>
                {a}
            </div>
        );
    }
}
export default App;
