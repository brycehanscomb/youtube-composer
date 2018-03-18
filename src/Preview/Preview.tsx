import * as React from 'react';
import { throttle } from 'lodash';

export default class Preview extends React.Component<any> {
    state = {
        readyPlayers: 0,
        realTime: Date.now(),
        initialTime: Math.min(...this.props.tracks.map(track => track.videoInPoint)),
        time: Math.min(...this.props.tracks.map(track => track.videoInPoint))
    };

    timeTicker;

    nodes = {};

    players : {[key: string]: YT.Player} = {};

    constructor(props) {
        super(props);

        this.checkIfAnyPlayersShouldStart = throttle(
            this.checkIfAnyPlayersShouldStart.bind(this),
            333
        );
    }

    startTime = () => {
        this.setState({
            realTime: Date.now(),
            initialTime: Math.min(...this.props.tracks.map(track => track.videoInPoint))
        }, this.storeTime);

    };

    stopTime = () => {
        clearTimeout(this.timeTicker);

        this.setState({
            realTime: Date.now(),
            initialTime: -1,
            time: -1
        });
    };

    storeTime = () => {
        const timeDiff = Date.now() - this.state.realTime;

        this.setState({
            time: this.state.initialTime + timeDiff
        });

        this.timeTicker = setTimeout(this.storeTime, 333);
    };

    componentDidUpdate() {
        if (this.state.readyPlayers === this.props.tracks.length) {
            this.props.onReady();

            if (!this.timeTicker) {
                this.startTime();
            }
            //
            // Object.entries(this.players).forEach(([videoId, player]) => {
            //     // player.seekTo(this.getTrackData(videoId).videoInPoint / 1000, true);
            //     // player.playVideo();
            // });

            this.checkIfAnyPlayersShouldStart();
            this.checkIfAnyPlayersShouldStop();
        }
    }

    getTime = () => {
        return this.state.time;
    };

    checkIfAnyPlayersShouldStart() {
        if (Object.values(this.players).every(p => p.getPlayerState() === YT.PlayerState.PLAYING)) {
            return;
        }

        Object.entries(this.players).forEach(([videoId, player]) => {
            const shouldTrackStart = this.getTime() >= this.getTrackData(videoId).trackStart;
            const hasVideoPassedOutPoint = player.getCurrentTime() * 1000 >= this.getTrackData(videoId).videoOutPoint;
            const isVideoPlaying = player.getPlayerState() === YT.PlayerState.PLAYING;
            const hasVideoBeenStopped = player.getPlayerState() === YT.PlayerState.ENDED;

            if (shouldTrackStart && !hasVideoPassedOutPoint && !isVideoPlaying && !hasVideoBeenStopped) {
                player.seekTo(this.getTrackData(videoId).videoInPoint / 1000, true);
                player.playVideo();
            }
        });

        if (this.timeTicker) {
            setTimeout(this.checkIfAnyPlayersShouldStart, 500);
        }
    }

    checkIfAnyPlayersShouldStop = () => {
        Object.entries(this.players).forEach(([videoId, player]) => {
            const hasVideoEnded = player.getCurrentTime() * 1000 >= this.getTrackData(videoId).videoOutPoint;
            // const isTrack
            if (hasVideoEnded) {
                player.stopVideo();
            }
        });

        setTimeout(this.checkIfAnyPlayersShouldStop, 333);
    };

    getTrackData(videoId) {
        return this.props.tracks.find(track => track.videoId === videoId);
    }

    componentDidMount() {
        Object.entries(this.nodes).forEach(([videoId, node]) => {
            const player = new YT.Player(node as any, {
                videoId,
                playerVars: {
                    rel: 0
                },
                events: {
                    onReady: () => {
                        player.seekTo(
                            this.getTrackData(videoId).videoInPoint / 1000,
                            true
                        );
                        player.playVideo();
                    },
                    onStateChange: (event: YT.OnStateChangeEvent) => {
                        if (event.data === YT.PlayerState.PLAYING && this.state.readyPlayers !== this.props.tracks.length) {
                            player.pauseVideo();
                            player.seekTo(
                                this.getTrackData(videoId).videoInPoint / 1000,
                                true
                            );
                            this.setState({
                                readyPlayers: this.state.readyPlayers + 1
                            });
                        }
                    }
                }
            });

            this.players[videoId] = player;
        });
    }

    onPlayButtonPressed = () => {
        // Object.entries(this.players).forEach(([videoId, player]) => {
        //     player.seekTo(this.getTrackData(videoId).videoInPoint / 1000, true);
        //     player.playVideo();
        // });
        this.startTime();
        this.checkIfAnyPlayersShouldStart();
    };

    onStopButtonPressed = () => {
        this.stopTime();

        Object.entries(this.players).forEach(([videoId, player]) => {
            // player.seekTo(this.getTrackData(videoId).videoInPoint / 1000, true);
            player.pauseVideo();
        });

    };

    render() {
        return (
            <div className="Preview">
                <p>
                    {this.getTime()}
                    <button onClick={this.onPlayButtonPressed}>
                        Play all
                    </button>
                    <button onClick={this.onStopButtonPressed}>
                        Stop
                    </button>
                </p>
                <div style={{
                    display: 'flex',

                }}>
                    {this.props.tracks.map(track => {
                        return (
                            <div>
                                <div
                                    key={track.videoId}
                                    ref={el => this.nodes[track.videoId] = el}
                                >
                                    Loading {track.videoId}...
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}