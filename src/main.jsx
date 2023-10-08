import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import {Provider} from "react-redux";
import { NotificationsProvider } from '@mantine/notifications';
import store from "./store";
import * as buffer from "buffer";
window.Buffer = window.Buffer || buffer.Buffer;

// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Provider store={store}>
            <NotificationsProvider>
                <App/>
            </NotificationsProvider>
        </Provider>,
    </BrowserRouter>
)
