import * as React from 'react';
import {EditorTrack} from "../App/App";
import {throttle} from 'lodash';

interface IProps {
    tracks: Array<EditorTrack>,
    time: number
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

    private registerPlayerNode = (track, el : HTMLElement | null) : void => {

        if (!el) {
            return;
        }

        this.playerNodes.set(track, el);
    };

    constructor(props) {
        super(props);

        this.sync = throttle(this.sync.bind(this), 2000);
    }

    private sync() {
        this.players.forEach(this.syncPlayerTime);
    }

    private syncPlayerTime = (player : YT.Player, track : EditorTrack) : void => {
        const isBeforeTrackStart = this.props.time <= track.trackStart;
        const isAfterTrackEnd = this.props.time >= (
            track.videoOutPoint // TODO: what if this doesn't start at zero
            // TODO: what if this is trimmed?
        );

        if (isBeforeTrackStart) {
            this.seekTo(player, track.trackStart);
        } else if (isAfterTrackEnd) {
            this.seekTo(player, track.videoOutPoint)
        } else {
            player.playVideo();
            this.seekTo(player, this.props.time);
        }
    };

    private seekTo(player : YT.Player, ms : number) {
        player.seekTo(sec(ms), true);
    }

    componentDidUpdate() {
        if (this.isReady()) {
            this.playerNodes.clear(); // don't need the divs anymore, they've been replaced by YT player iframes
            this.sync();
        }
    }

    componentWillUnmount() {
        this.players.forEach(player => player.destroy());
        this.players.clear();
        this.playerNodes.clear();
    }

    componentDidMount() {
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
                        player.setVolume(0);
                        player.seekTo(track.videoInPoint / 1000, true);
                        player.playVideo();
                    },
                    onStateChange : (event : YT.OnStateChangeEvent) => {
                        if (event.data === YT.PlayerState.PLAYING) {
                            if (this.isReady() === false) {
                                player.pauseVideo();
                                player.setVolume(100);
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