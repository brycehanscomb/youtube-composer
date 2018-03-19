import * as React from 'react';
import * as interact from 'interactjs';
import './TimelineTrack.css';
import {getMilliSecondsFromPixelWidth, getWidth} from '../utils';

interface IProps {
    duration: number,
    videoId: string,
    zoom: string | number,
    startOffset: number,
    onTrim: (whichEnd : 'start' | 'end', delta: number) => void,
    onNudge: (delta: number) => void,
    videoInPoint: number,
    videoOutPoint: number,
}

export default class TimelineTrack extends React.Component<IProps, any> {

    private cropHandleLeft : HTMLElement | null;
    private cropHandleRight : HTMLElement | null;
    private nudgeHandle : HTMLElement | null;

    componentDidMount() {
        if (!this.cropHandleLeft || !this.cropHandleRight || !this.nudgeHandle) {
            return;
        }

        interact(this.nudgeHandle).draggable({ axis: 'x'})
            .on('dragmove', this.onNudgeHandleDragMove);

        interact(this.cropHandleLeft).draggable({ axis: 'x' })
            .on('dragmove', this.onCropHandleDragMove.bind(this, 'start'));

        interact(this.cropHandleRight).draggable({ axis: 'x' })
            .on('dragmove', this.onCropHandleDragMove.bind(this, 'end'));
    }

    componentWillUnmount() {
        if (!this.cropHandleLeft || !this.cropHandleRight || !this.nudgeHandle) {
            return;
        }

        interact(this.nudgeHandle).unset();
        interact(this.cropHandleLeft).unset();
        interact(this.cropHandleRight).unset();
    }

    onNudgeHandleDragMove = (event: Interact.InteractEvent) => {
        const deltaTime = getMilliSecondsFromPixelWidth(event.dx, this.props.zoom);
        this.props.onNudge(deltaTime);
    };

    onCropHandleDragMove = (whichEnd : 'start' | 'end', event : Interact.InteractEvent) => {
        const deltaTime = getMilliSecondsFromPixelWidth(event.dx, this.props.zoom);
        this.props.onTrim(whichEnd, deltaTime);
    };

    render() {
        return (
            <div className="TimelineTrack" style={{
                backgroundImage: `url("http://img.youtube.com/vi/${this.props.videoId}/default.jpg")`,
                width: getWidth(this.props.videoOutPoint - this.props.videoInPoint, this.props.zoom),
                marginLeft: getWidth(this.props.startOffset, this.props.zoom)
            }}>
                <div ref={el => this.cropHandleLeft = el} className="TimelineTrack__CropHandle left" />
                <div ref={el => this.nudgeHandle = el} className="TimelineTrack__NudgeHandle" />
                <div ref={el => this.cropHandleRight = el} className="TimelineTrack__CropHandle right" />
            </div>
        );
    }
}