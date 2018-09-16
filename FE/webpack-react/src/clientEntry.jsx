import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

const render = module.hot ? ReactDOM.render : ReactDOM.hydrate;

render(<App />, document.getElementById('app'));
if (module.hot) {
    module.hot.accept();
}
