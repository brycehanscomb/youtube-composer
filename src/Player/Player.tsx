import * as React from 'react';

const style = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, auto)',
    textAlign: 'left'
};

export default class Player extends React.Component<{
    videoId : string,
    play: boolean,
    onReady: () => void,
    startPoint: number,
    delay: number
}> {
    state = {

    };

    private rootNode : HTMLElement | null;

    private player : YT.Player;

    componentDidMount() {
        if (this.rootNode === null) {
            return;
        }

        this.player = new YT.Player(this.rootNode.id, {
            videoId: this.props.videoId,
            events: {
                onReady: () => {
                    this.props.onReady();
                    this.player.seekTo(this.props.startPoint / 1000, true);
                }
            }
        });
    }

    componentWillReceiveProps(nextProps : any) {
        if (nextProps.play === true) {
            this.player.playVideo();
        } else {
            if (this.player.pauseVideo !== undefined) {
                this.player.pauseVideo();
            }
        }
    }

    render() {
        return (
            <div className="player-column">
                <dl style={style}>
                    <dt>
                        Video
                    </dt>
                    <dd>
                        <a href={`https://www.youtube.com/watch?v=${this.props.videoId}`}>
                            {this.props.videoId}
                        </a>
                    </dd>
                    <dt>
                        Video Start Point
                    </dt>
                    <dd>
                        {this.props.startPoint} ms
                    </dd>
                    <dt>
                        Start Delay
                    </dt>
                    <dd>
                        {this.props.delay} ms
                    </dd>
                    <dt>
                        Should be playing now
                    </dt>
                    <dd>
                        {this.props.play === true ? 'Yes' : 'No'}
                    </dd>
                </dl>
                <div id={this.props.videoId} ref={el => this.rootNode = el} />
            </div>
        );
    }
}