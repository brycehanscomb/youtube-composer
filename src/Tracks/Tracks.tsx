import * as React from 'react';
import Track from "../Track/Track";

export default class Tracks extends React.Component<any, any> {
    render() {
        return (
            <div className="Tracks">
                {this.props.tracks.map(track => {
                    if (this.props.durations[track.videoId]) {
                        return <Track
                            key={track.videoId}
                            videoId={track.videoId}
                            duration={this.props.durations[track.videoId]}
                            videoInPoint={track.videoInPoint}
                            videoOutPoint={track.videoOutPoint}
                            onTrim={(...args) => this.props.onTrim(track, ...args)}
                        />
                    } else {
                        return <span key={track.videoId}>Loading {track.videoId}...</span>
                    }
                })}
            </div>
        );
    }
}