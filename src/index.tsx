import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App/App';
import './index.css';
import {initYoutubeAPI} from "./MetaGatherer";

initYoutubeAPI().then(() => {
    ReactDOM.render(
        <App />,
        document.getElementById('root') as HTMLElement
    );
});