import * as React from 'react';
import * as interact from 'interactjs';
import './Track.css';

interface IProps {
    videoId: string,
    videoInPoint: number,
    videoOutPoint: number,
    duration: number,
    onTrim: (whichEnd: string, newTrimValue: number) => void
}

/**
 * @see https://stackoverflow.com/a/16520928/1063035
 */
function getTimeLabel(totalMs : number, percentage : number) : string {
    const targetMs = (totalMs / 100) * percentage;

    const second = (targetMs / 1000) % 60;
    const minute = (targetMs / (1000 * 60)) % 60;
    const hour = (targetMs / (1000 * 60 * 60)) % 24;

    // return `${hour}:${minute}:${second}`;

    return [hour, minute, second]
        .map(Math.floor)
        .map(val => {
            if (val < 10) {
                return `0${val}`;
            } else {
                return val;
            }
        })
        .join(':');
}

function msToPercent(totalMs, fractionalMs) {
    return (fractionalMs / totalMs) * 100;
}

export default class Track extends React.Component<IProps> {
    private rootNode : HTMLElement | null;
    private cropStartHandle : HTMLElement | null;
    private cropEndHandle : HTMLElement | null;
    private trackWidth : number = 0;

    state = {
        cropStart: msToPercent(this.props.duration, this.props.videoInPoint),
        cropEnd: 0
    };

    componentDidMount() {
        if (!this.cropEndHandle || !this.cropStartHandle) {
            return;
        }

        if (this.rootNode === null) {
            return;
        }

        this.trackWidth = this.rootNode.getBoundingClientRect().width;

        interact(this.cropStartHandle).draggable({
            axis: 'x',
        })
            .on('dragmove', this.onDragStartChanged)
            .on('dragend', this.onDragStartFinished);

        interact(this.cropEndHandle).draggable({
            axis: 'x',
        })
            .on('dragmove', this.onDragEndChanged)
            .on('dragend', this.onDragEndFinished);
    }

    componentWillUnmount() {
        if (!this.cropEndHandle || !this.cropStartHandle) {
            return;
        }

        interact(this.cropStartHandle).unset();
        interact(this.cropEndHandle).unset();
    }

    onDragStartChanged = (event : Interact.InteractEvent) => {
        const percentChanged = (event.dx/this.trackWidth) * 100;
        const newValue = this.state.cropStart + percentChanged;

        this.setState({
            cropStart: Math.max(0, newValue)
        });
    };

    onDragEndChanged = (event : Interact.InteractEvent) => {
        const percentChanged = (event.dx/this.trackWidth) * 100;
        const newValue = this.state.cropEnd - percentChanged;

        this.setState({
            cropEnd: Math.max(0, newValue)
        });
    };

    onDragStartFinished = (event : Interact.InteractEvent) => {
        const percentChanged = (event.dx/this.trackWidth) * 100;
        const newValue = this.state.cropStart + percentChanged;

        this.setState({
            cropStart: Math.max(0, newValue)
        });

        this.props.onTrim('start', newValue);
    };

    onDragEndFinished = (event : Interact.InteractEvent) => {
        const percentChanged = (event.dx/this.trackWidth) * 100;
        const newValue = this.state.cropEnd - percentChanged;

        this.setState({
            cropEnd: Math.max(0, newValue)
        });

        this.props.onTrim('end', newValue);
    };

    render() {
        return (
            <div ref={el => this.rootNode = el} className="Track">
                <div className="Track__ThumbnailWrapper" style={{
                    paddingLeft: `${this.state.cropStart}%`,
                    paddingRight: `${this.state.cropEnd}%`,
                }}>
                    <div className="Track__Thumbnail" style={{
                        backgroundImage: `url("http://img.youtube.com/vi/${this.props.videoId}/default.jpg")`
                    }}>
                        <div ref={el => this.cropStartHandle = el} className="Track__Trimmer left" title="Crop start" />
                        <div className="Track__Nudger" title="Move clip">
                            <span className="Track__CropStartLabel">{getTimeLabel(this.props.duration, this.state.cropStart)}</span>
                            <span className="Track__CropEndLabel">{getTimeLabel(this.props.duration, 100 - this.state.cropEnd)}</span>
                        </div>
                        <div className="Track__Shifter" title="Shift clip within crop points" />
                        <div ref={el => this.cropEndHandle = el} className="Track__Trimmer right" title="Crop end" />
                    </div>
                </div>
            </div>
        );
    }
}