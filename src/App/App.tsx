import * as React from 'react';
import './App.css';
import Timeline from "../Timeline/Timeline";
import {getVideoDuration} from "../MetaGatherer";
import WaitFor from "../WaitFor/WaitFor";

export default class App extends React.Component {
    state = {
        tracks: [
            {
                videoId: 'O9Nxe5P_HoA',
                videoInPoint: 38000,
                trackStart: 0,
                duration: -1
            },
            {
                videoId: '-UxD1FObOH4',
                videoInPoint: 41500,
                trackStart: 0,
                duration: -1
            },
        ]
    };

    componentDidMount() {
        Promise.all(
            this.state.tracks
                .map(track => track.videoId)
                .map(getVideoDuration)
        ).then(durations => {
            this.setState({
                tracks: this.state.tracks.map((track, index) => {
                    return {
                        ...track,
                        duration: durations[index]
                    };
                })
            })
        });
    }

    areDurationsReady = () => {
        return this.state.tracks.every(
            track => track.duration !== -1
        );
    };

    render() {
        return (
            <div className="App">
                <header>Header</header>
                <div className="middle">Working area</div>
                <WaitFor when={this.areDurationsReady()}>
                    <Timeline tracks={this.state.tracks} />
                </WaitFor>
            </div>
        );
    }
}