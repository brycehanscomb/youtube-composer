import * as React from 'react';
import './App.css';
import Timeline from "../Timeline/Timeline";

export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <header>Header</header>
                <div className="middle">Working area</div>
                <Timeline />
            </div>
        );
    }
}