import * as React from 'react';

export default class Player extends React.Component<{
    videoId : string,
    play: boolean,
    onReady: () => void,
    startPoint: number
}> {
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
    //
    // componentWillReceiveProps(nextProps : any) {
    //     if (nextProps.play === true) {
    //         this.player.playVideo();
    //     } else {
    //         if (this.player.pauseVideo !== undefined) {
    //             this.player.pauseVideo();
    //         }
    //     }
    // }

    render() {
        return (
            <div
                id={this.props.videoId}
                ref={el => this.rootNode = el}
            />
        );
    }
}