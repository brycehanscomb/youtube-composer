import * as React from 'react';
import './App.css';
import Player from "./Player/Player";

class App extends React.Component {
    state = {
        isYoutubeAPIReady: false,
        tracks: [
            {
                videoId: 'YYfWpUvtJhs',
                trackStartTime: 0,
                videoStartPoint: 76750
            },
            {
                videoId: 'T7iVpEwmuRo',
                trackStartTime: 0,
                videoStartPoint: 0
            }
        ],
        readyTracks: 0,
        timelineStartedAt: -1,
        currentTimelineTick: -1
    };

    shouldVideoBePlaying = (track : any) => {
        if (this.state.readyTracks !== this.state.tracks.length) {
            return false;
        }

        if (this.getTime() >= track.trackStartTime) {
            return true;
        }

        return false;
    };

    startTimer() {
        this.setState({
            timelineStartedAt: Date.now()
        });
        this.updateTimer();
    }

    updateTimer = () => {
        this.setState({
            currentTimelineTick: Date.now()
        }, () => {
            setTimeout(this.updateTimer, (1000 / 30));
        });
    };

    getTime() {
        return this.state.currentTimelineTick - this.state.timelineStartedAt;
    }

    componentDidMount() {
        this.checkYoutubeAPI();
    }

    checkYoutubeAPI = () => {
        if (global['YT']) {
            this.setState({
                isYoutubeAPIReady: true
            });
        } else {
            setTimeout(this.checkYoutubeAPI, 1000);
        }
    };

    onTrackPlayerReady = () => {
        this.setState(
            { readyTracks: this.state.readyTracks + 1 },
            () => {
            if (this.state.readyTracks === this.state.tracks.length) {
                this.startTimer();
            }
        });
    };

    render() {
        if (!this.state.isYoutubeAPIReady) {
            return 'Waiting on YT...';
        }

        return (
            <div>
                <div className='App'>
                    {this.state.tracks.map(track => {
                        return (
                            <Player
                                key={track.videoId}
                                delay={track.trackStartTime}
                                videoId={track.videoId}
                                startPoint={track.videoStartPoint}
                                play={this.shouldVideoBePlaying(track)}
                                onReady={this.onTrackPlayerReady}
                            />
                        );
                    })}
                </div>
                {this.state.tracks[0].videoId !== '-eohHwsplvY' && (
                    <p>
                        <button onClick={() => {
                            this.setState({
                                tracks: [
                                    {
                                        videoId: '-eohHwsplvY', // NY I love you
                                        videoStartPoint: 0,
                                        trackStartTime: 0
                                    },
                                    {
                                        videoId: '3io0Ttj74Ro', // Elevator to the gallows,
                                        videoStartPoint: 0,
                                        trackStartTime: 33000
                                    },
                                ],
                                readyTracks: 0,
                                timelineStartedAt: -1,
                                currentTimelineTick: -1
                            });
                        }}>
                            <big>
                                Try another set of videos
                            </big>
                        </button>
                    </p>
                )}
            </div>
        );
    }
}

export default App;
