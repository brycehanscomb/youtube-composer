import * as React from 'react';
import {EditorTrack} from "../App/App";
import {noop} from 'lodash';
import Timer = NodeJS.Timer;

interface IProps {
    tracks: Array<EditorTrack>,
    time: number,
    isPlaying: boolean
}

interface IState {
    readyPlayers: number
}

const sec = (ms : number ) : number => {
    return ms / 1000;
};

export default class Preview extends React.Component<IProps, IState> {
    state : IState = {
        readyPlayers: 0
    };

    private playerNodes : Map<EditorTrack, HTMLElement> = new Map();
    private players : Map<EditorTrack, YT.Player> = new Map();

    private isReady = () : boolean => {
        return this.state.readyPlayers === this.props.tracks.length;
    };

    private playQueue : Array<Timer> = [];

    private registerPlayerNode = (track, el : HTMLElement | null) : void => {

        if (!el) {
            return;
        }

        this.playerNodes.set(track, el);
    };

    onReady = () => {
        this.playerNodes.clear(); // don't need the divs anymore, they've been replaced by YT player iframes

        this.onReady = noop;
    };

    // private seekTo(player : YT.Player, ms : number) {
    //     /**
    //      * Since the player can only seek to the nearest keyframe,
    //      * we may not have the player seek to the exact millisecond
    //      * that we intended. However, constantly syncing to the
    //      * closest-available keyframe sounds choppy to the ear,
    //      * so we compromise and only "nudge" they player's actual
    //      * position to where it "should be" if the difference
    //      * between where-it-is and where-it-should-be is over a
    //      * certain time threshold.
    //      */
    //     const timeError = (player.getCurrentTime() * 1000) - this.props.time;
    //
    //     if (Math.abs(timeError) > 200) {
    //         player.seekTo(sec(ms), true);
    //     }
    // }

    componentDidUpdate(prevProps : IProps) {
        if (this.isReady()) {
            this.onReady();
        }

        if (
            prevProps.isPlaying === false &&
            this.props.isPlaying === true
        ) {
            this.setupPlayQueue();
        }

        if (
            prevProps.isPlaying === true &&
            this.props.isPlaying === false
        ) {
            this.pauseAll();
        }
    }

    componentWillUnmount() {
        this.players.forEach(player => player.destroy());
        this.players.clear();
        this.playerNodes.clear();
    }

    private pauseAll() {
        this.destroyPlayQueue();
        this.players.forEach(player => player.pauseVideo());
    }

    private destroyPlayQueue = () => {
        this.playQueue.forEach(clearTimeout);
        this.playQueue.length = 0;
    };

    private setupPlayQueue = () => {
        this.destroyPlayQueue();

        this.props.tracks.forEach(track => {
            const player = this.players.get(track);

            if (!player) {
                console.warn('could not find player');
                return;
            }

            player.seekTo(
                sec(track.videoInPoint),
                true
            );

            const startTimer = setTimeout(
                () => player.playVideo(),
                track.trackStart
            );

            this.playQueue.push(startTimer);

            const endTimer = setTimeout(
                () => player.pauseVideo(),
                track.trackStart + (track.videoOutPoint - track.videoInPoint)
            );

            this.playQueue.push(endTimer);
        });
    };

    componentDidMount() : void {
        this.playerNodes.forEach((el, track) => {
            const player = new YT.Player(el as any, {
                videoId: track.videoId,
                playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    showinfo: 0
                },
                width: 320,
                height: 200,
                events: {
                    onReady: () => {
                        player.setPlaybackQuality('small')
                        player.setVolume(0);
                        player.seekTo(track.videoInPoint / 1000, true);
                        player.playVideo();
                    },
                    onStateChange : (event : YT.OnStateChangeEvent) => {
                        if (event.data === YT.PlayerState.PLAYING) {
                            if (this.isReady() === false) {
                                player.pauseVideo();
                                player.setVolume(track.volume);
                                player.seekTo(track.videoInPoint / 1000, true);
                                this.players.set(track, player);
                                this.setState({
                                    readyPlayers: this.state.readyPlayers + 1
                                });
                            }
                        }
                    }
                }
            });
        });
    }

    render() {
        let content;

        content = this.props.tracks.map(track => {
            return (
                <div
                    ref={el => this.registerPlayerNode(track, el)}
                    key={track.videoId}
                >Loading {track.videoId}...</div>
            );
        });

        return (
            <div className="Preview">
                {content}
            </div>
        );
    }
}