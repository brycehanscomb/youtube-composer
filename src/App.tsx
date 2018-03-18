import * as React from 'react';
import './App.css';
import Tracks from "./Tracks/Tracks";
import {getVideoDuration} from "./MetaGatherer";

class App extends React.Component {
    state = {
        tracks: [
            {
                videoId: '7nEpsW2kEFA',
                videoInPoint: 0,
                videoOutPoint: -1
            }
        ],
        durations: {}
    };

    componentDidMount() {
        this.state.tracks.forEach(track => {
            getVideoDuration(track.videoId).then((duration) => {
                this.setState({
                    durations: {
                        ...this.state.durations,
                        [track.videoId]: duration
                    },
                    tracks: this.state.tracks.map(it => {
                        if (it.videoId !== track.videoId) {
                            return it;
                        }

                        return {
                            ...track,
                            videoOutPoint: duration
                        };
                    })
                });
            });
        });
    }

    onTrim = (track : any, whichEnd: string, newTrimValue : number) => {
        const duration = this.state.durations[track.videoId];

        const trimPointInMs = (duration / 100) * newTrimValue;

        this.setState({
            tracks: this.state.tracks.map(it => {
                if (it.videoId !== track.videoId) {
                    return it;
                }

                switch(whichEnd) {
                    case 'start':
                        return {
                            ...it,
                            videoInPoint: trimPointInMs
                        };
                    case 'end':
                        return {
                            ...it,
                            videoOutPoint: duration - trimPointInMs
                        };
                    default:
                        throw new RangeError('Wrong value');
                }
            })
        });


    };

    render() {
        return (
            <div>
                <Tracks
                    tracks={this.state.tracks}
                    durations={this.state.durations}
                    onTrim={this.onTrim}
                />
            </div>
        );
    }
}

export default App;
