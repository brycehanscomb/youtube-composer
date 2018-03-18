import * as React from 'react';
import './TimelineTrack.css';
import {getWidth} from '../utils';

export default class TimelineTrack extends React.Component<any, any> {
    render() {
        return (
            <div className="TimelineTrack" style={{
                backgroundImage: `url("http://img.youtube.com/vi/${this.props.videoId}/default.jpg")`,
                width: getWidth(this.props.duration, this.props.zoom),
                marginLeft: getWidth(this.props.startOffset, this.props.zoom)
            }} />
        );
    }
}