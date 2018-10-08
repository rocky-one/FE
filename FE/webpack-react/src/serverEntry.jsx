import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';
import { createStoreMap } from './store/store';
import Routes from './config/router';

useStaticRendering(true);

export default (stores, routerContext, url) => {
    return <Provider {...stores}>
        <StaticRouter context={routerContext} location={url}>
            <Routes />
        </StaticRouter>
    </Provider>
}

export { createStoreMap }
