import * as React from 'react';
import './App.css';
import Timeline from "../Timeline/Timeline";
import {getVideoDuration} from "../MetaGatherer";
import WaitFor from "../WaitFor/WaitFor";

export default class App extends React.Component {
    state = {
        tracks: [
            {
                videoId: 'QjxScn7cKo8',
                videoInPoint: 0,
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

    onTrackNudge = (track, delta : number) => {
        this.setState({
            tracks: this.state.tracks.map(it => {
                if (it !== track) {
                    return it;
                } else {
                    const newValue = it.trackStart + delta;

                    return {
                        ...track,
                        trackStart: Math.max(0, newValue)
                    };
                }
            })
        });
    };

    onTrimStart = (track, delta : number) => {
        this.setState({
            tracks: this.state.tracks.map(it => {
                if (it !== track) {
                    return it;
                } else {
                    return {
                        ...track,
                        videoInPoint: it.videoInPoint + delta
                    };
                }
            })
        });
    };

    render() {
        return (
            <div className="App">
                <header>Header</header>
                <div className="middle">Working area</div>
                <WaitFor when={this.areDurationsReady()}>
                    <Timeline
                        tracks={this.state.tracks}
                        onTrimStart={this.onTrimStart}
                        onTrackNudge={this.onTrackNudge}
                    />
                </WaitFor>
            </div>
        );
    }
}