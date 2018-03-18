import * as React from 'react';
import './App.css';
import Tracks from "./Tracks/Tracks";
import {getVideoDuration} from "./MetaGatherer";
import Preview from "./Preview/Preview";

class App extends React.Component {
    state = {
        tracks: [
            // {
            //     videoId: 'mto2mNFbrps',
            //     videoInPoint: 0,
            //     videoOutPoint: -1
            // }
            {
                videoId: 'YYfWpUvtJhs',
                videoInPoint: 76750 + 210000
            },
            {
                videoId: 'T7iVpEwmuRo',
                videoInPoint: 0 + 210000
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

    getPreviewState = () => {
        return {
            tracks: this.state.tracks.map(track => {
                return {
                    ...track,
                    duration: this.state.durations[track.videoId]
                };
            })
        };
    };

    onPreviewReady = () => {

    };

    render() {
        return (
            <div>
                <Tracks
                    tracks={this.state.tracks}
                    durations={this.state.durations}
                    onTrim={this.onTrim}
                />
                <Preview {...this.getPreviewState()} onReady={this.onPreviewReady} />
            </div>
        );
    }
}

export default App;
