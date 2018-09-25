import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                首页1
            </div>
        )
    }
}

ReactDOM.render(<App />,document.getElementById('app'));