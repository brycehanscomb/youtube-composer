import * as React from 'react';

export default class Preview extends React.Component<any> {
    state = {
        readyPlayers: 0
    };

    nodes = {};

    players : {[key: string]: YT.Player} = {};

    componentDidUpdate() {
        if (this.state.readyPlayers === this.props.tracks.length) {
            this.props.onReady();

            Object.entries(this.players).forEach(([videoId, player]) => {
                player.seekTo(this.getTrackData(videoId).videoInPoint / 1000, true);
                player.playVideo();
            });

            this.checkIfAnyPlayersShouldStop();
        }
    }

    checkIfAnyPlayersShouldStop = () => {
        Object.entries(this.players).forEach(([videoId, player]) => {
            if (player.getCurrentTime() * 1000 >= this.getTrackData(videoId).videoOutPoint) {
                player.pauseVideo();
            }
        });

        setTimeout(this.checkIfAnyPlayersShouldStop, 500);
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
                        player.pauseVideo();
                        this.setState({
                            readyPlayers: this.state.readyPlayers + 1
                        });
                    }
                }
            });

            this.players[videoId] = player;
        });
    }

    onPlayButtonPressed = () => {
        Object.entries(this.players).forEach(([videoId, player]) => {
            player.seekTo(this.getTrackData(videoId).videoInPoint / 1000, true);
            player.playVideo();
        });
    };

    onStopButtonPressed = () => {
        Object.entries(this.players).forEach(([videoId, player]) => {
            // player.seekTo(this.getTrackData(videoId).videoInPoint / 1000, true);
            player.pauseVideo();
        });
    };

    render() {
        return (
            <div className="Preview">
                <p>
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
                            <div
                                key={track.videoId}
                                ref={el => this.nodes[track.videoId] = el}
                            >
                                Loading {track.videoId}...
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }
}