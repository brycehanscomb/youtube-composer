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
    onVolumeChange: (delta : number) => void,
    videoInPoint: number,
    videoOutPoint: number,
    volume: number
}

const flipSign = (n : number) : number => n * -1;

export default class TimelineTrack extends React.Component<IProps, any> {

    private rootNode : HTMLElement | null;
    private cropHandleLeft : HTMLElement | null;
    private cropHandleRight : HTMLElement | null;
    private nudgeHandle : HTMLElement | null;
    private volumeHandle : HTMLElement | null;

    state = {
        nominalVolume: this.props.volume || 100
    };

    componentDidMount() {
        if (!this.cropHandleLeft || !this.cropHandleRight || !this.nudgeHandle || !this.volumeHandle) {
            return;
        }

        interact(this.nudgeHandle).draggable({ axis: 'x'})
            .on('dragmove', this.onNudgeHandleDragMove);

        interact(this.cropHandleLeft).draggable({ axis: 'x' })
            .on('dragmove', this.onCropHandleDragMove.bind(this, 'start'));

        interact(this.cropHandleRight).draggable({ axis: 'x' })
            .on('dragmove', this.onCropHandleDragMove.bind(this, 'end'));

        interact(this.volumeHandle).draggable({axis: 'y'})
            .on('dragmove', this.onVolumeHandleMove);
    }

    componentWillUnmount() {
        if (!this.cropHandleLeft || !this.cropHandleRight || !this.nudgeHandle || !this.volumeHandle) {
            return;
        }

        interact(this.nudgeHandle).unset();
        interact(this.cropHandleLeft).unset();
        interact(this.cropHandleRight).unset();
        interact(this.volumeHandle).unset();
    }

    onNudgeHandleDragMove = (event: Interact.InteractEvent) => {
        const deltaTime = getMilliSecondsFromPixelWidth(event.dx, this.props.zoom);
        this.props.onNudge(deltaTime);
    };

    onVolumeHandleMove = (event: Interact.InteractEvent) => {
        if (!this.rootNode) {
            return;
        }

        const deltaPx = flipSign(event.dy);
        const containerHeight = this.rootNode.getBoundingClientRect().height;
        const percentageChange = (deltaPx / containerHeight) * 100;

        this.props.onVolumeChange(percentageChange);
    };

    onMuteToggled = () => {
        if (this.props.volume === 0) {
            this.props.onVolumeChange((-this.props.volume) + this.state.nominalVolume);
        } else {
            this.props.onVolumeChange(-this.props.volume);
        }
    };

    onCropHandleDragMove = (whichEnd : 'start' | 'end', event : Interact.InteractEvent) => {
        const deltaTime = getMilliSecondsFromPixelWidth(event.dx, this.props.zoom);
        this.props.onTrim(whichEnd, deltaTime);
    };

    render() {
        return (
            <div className="TimelineTrack">
                <div className="TimelineTrack__Tools">
                    <button onClick={this.onMuteToggled} title={this.props.volume > 0 ? 'Mute' : 'Un-mute'}>
                        🔈 {Math.floor(this.props.volume)}
                    </button>
                </div>
                <div ref={el => this.rootNode = el} className="TimelineTrack__Track" style={{
                    backgroundImage: `url("http://img.youtube.com/vi/${this.props.videoId}/default.jpg")`,
                    width: getWidth(this.props.videoOutPoint - this.props.videoInPoint, this.props.zoom),
                    marginLeft: getWidth(this.props.startOffset, this.props.zoom)
                }}>
                    <div ref={el => this.cropHandleLeft = el} className="TimelineTrack__CropHandle left"/>
                    <div ref={el => this.nudgeHandle = el} className="TimelineTrack__NudgeHandle"/>
                    <div ref={el => this.cropHandleRight = el} className="TimelineTrack__CropHandle right"/>
                    <div
                        title={`Volume: ${this.props.volume}%`}
                        ref={el => this.volumeHandle = el}
                        className="TimelineTrack__VolumeHandle"
                        style={{top: `${100 - this.props.volume}%`}}
                    />
                </div>
            </div>
        );
    }
}