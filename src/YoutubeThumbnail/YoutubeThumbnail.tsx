import * as React from 'react';

export default class YoutubeThumbnail extends React.Component<{
    videoId: string
}> {
    render() {
        return (
            <img
                src={`http://img.youtube.com/vi/${this.props.videoId}/default.jpg`}
                alt={this.props.videoId}
            />
        );
    }
}