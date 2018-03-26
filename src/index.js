import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './App';
import './index.css';

const preloadedState = window.PRELOADED_STATE;
const store = configureStore(preloadedState);
const rootElement = document.getElementById('root');

render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement,
);
