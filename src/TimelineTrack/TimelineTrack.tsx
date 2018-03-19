import * as React from 'react';
import * as interact from 'interactjs';
import './TimelineTrack.css';
import {getMsFromPixelWidth, getWidth} from '../utils';

interface IProps {
    duration: number,
    videoId: string,
    zoom: string | number,
    startOffset: number,
    onTrim: (whichEnd : 'start' | 'end', delta: number) => void,
    onNudge: (delta: number) => void
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

        // interact(this.cropHandleLeft).draggable({
        //     axis: 'x'
        // })
        //     .on('dragmove', this.onCropHandleDragMove.bind(this, 'start'));
    }

    onNudgeHandleDragMove = (event: Interact.InteractEvent) => {
        const cropStartXPos = getWidth(this.props.startOffset, this.props.zoom);
        const deltaTime = getMsFromPixelWidth(cropStartXPos + event.dx, this.props.zoom);

        this.props.onNudge(deltaTime);
    };

    onCropHandleDragMove = (whichEnd : 'start' | 'end', event : Interact.InteractEvent) => {
        const cropStartXPos = getWidth(this.props.startOffset, this.props.zoom);
        const deltaTime = getMsFromPixelWidth(cropStartXPos + event.dx, this.props.zoom) * 1000;

        this.props.onTrim(whichEnd, deltaTime);
    };

    render() {
        return (
            <div className="TimelineTrack" style={{
                backgroundImage: `url("http://img.youtube.com/vi/${this.props.videoId}/default.jpg")`,
                width: getWidth(this.props.duration, this.props.zoom),
                marginLeft: getWidth(this.props.startOffset, this.props.zoom, true)
            }}>
                <div ref={el => this.cropHandleLeft = el} className="TimelineTrack__CropHandle left" />
                <div ref={el => this.nudgeHandle = el} className="TimelineTrack__NudgeHandle" />
                <div ref={el => this.cropHandleRight = el} className="TimelineTrack__CropHandle right" />
            </div>
        );
    }
}