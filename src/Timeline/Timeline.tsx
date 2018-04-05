import * as React from 'react';
import './Timeline.css';
import TimelineTrack from "../TimelineTrack/TimelineTrack";
import {getWidth} from "../utils";
import TimelinePlayhead from "../TimelinePlayhead/TimelinePlayhead";
import {EditorTrack} from "../App/App";

interface IState {
    zoom: number,
}

interface IProps {
    tracks: Array<EditorTrack>
    playheadPosition: number,

    onPlayheadMove: Function,
    onTrimStart: Function,
    onTrimEnd: Function
    onTrackNudge: Function,
    onTrackVolumeChange: Function
}

export default class Timeline extends React.Component<IProps, IState> {
    state = {
        zoom: 0,
    };

    private tracksEl : HTMLElement | null;

    private playTimer;
    private endOfSceneStopTimer;

    rewind = () => {
        this.props.onPlayheadMove(0 - this.props.playheadPosition);
    };

    play = () => {
        const stepsPerSecond = 3;
        const playStepTime = (1000 / stepsPerSecond);

        this.props.onPlayheadMove(playStepTime, true);
        this.keepPlayheadInView();
        this.playTimer = setTimeout(this.play, playStepTime);
        this.endOfSceneStopTimer = setTimeout(this.stop, (this.getSceneDuration() - this.props.playheadPosition) + playStepTime);
    };

    stop = () => {
        clearTimeout(this.playTimer);
        clearTimeout(this.endOfSceneStopTimer);
        this.playTimer = null;
        this.endOfSceneStopTimer = null;
        this.props.onPlayheadMove(0, false);
        this.keepPlayheadInView();
    };

    keepPlayheadInView = () => {
        if (!this.tracksEl || !this.tracksEl.parentElement) {
            return;
        }

        const rightPosOfTimeline = this.getTimelineWidth() + this.tracksEl.parentElement.scrollLeft;
        const leftPosOfTimeline = this.tracksEl.parentElement.scrollLeft;
        const playheadPosition = this.getPlayheadPosition();

        if (
            (playheadPosition > rightPosOfTimeline) ||
            (playheadPosition < leftPosOfTimeline)
        ) {
            this.tracksEl.parentElement.scrollLeft = playheadPosition - (this.getTimelineWidth() / 3);
        }
    };

    onZoomChanged = (event : React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            zoom: parseInt(event.target.value)
        });
    };

    getPlayheadPosition = () => {
        return getWidth(this.props.playheadPosition, this.state.zoom);
    };

    getTimelineWidth = () => {
        if (!this.tracksEl) {
            return 0;
        }

        return this.tracksEl.getBoundingClientRect().width;
    };

    handleTrackTrim = (track, whichEnd : 'start' | 'end', delta : number) => {
        switch(whichEnd) {
            case 'start':
                this.props.onTrimStart(track, delta);
            break;
            case 'end':
                this.props.onTrimEnd(track, delta);
            break;
        }
    };

    handleTrackNudge = (track, delta : number) => {
        this.props.onTrackNudge(track, delta);
    };


    handleTrackVolumeChange = (track, delta : number) => {
        this.props.onTrackVolumeChange(track, delta);
    };

    handlePlayheadMoved = (delta : number) => {
        this.props.onPlayheadMove(delta);
    };

    getSceneDuration = () : number => {
        return this.props.tracks.reduce((acc : number, cur : EditorTrack) : number => {
            const startsAt = cur.trackStart;
            const videoLength = cur.videoOutPoint - cur.videoInPoint;
            const endPoint = startsAt + videoLength;

            return Math.max(acc, endPoint);
        }, 0);
    };

    render() {
        return (
            <div className="Timeline">
                <div className="Timeline__Controls">
                    <button onClick={this.rewind}>
                        &lt;- Rewind
                    </button>
                    <button onClick={() => {
                        if (this.playTimer) {
                            this.stop();
                        } else {
                            this.play();
                        }
                    }}>
                        Play / Stop
                    </button>
                    <label>
                        Zoom:
                        <input
                            value={this.state.zoom}
                            type="range"
                            onChange={this.onZoomChanged}
                            min={-6}
                            max={6}
                            step={1}
                        />
                    </label>
                </div>
                <div className="Timeline__ScrollContainer">
                    <div className="Timeline__Tracks" ref={el => this.tracksEl = el}>
                        <div className="Timeline__Header">
                            <TimelinePlayhead
                                timelineWidth={this.getTimelineWidth()}
                                currentTime={this.props.playheadPosition}
                                zoom={this.state.zoom}
                                onMove={this.handlePlayheadMoved}
                            />
                        </div>
                        {this.props.tracks.map(track => {
                            return (
                                <TimelineTrack
                                    zoom={this.state.zoom}
                                    videoInPoint={track.videoInPoint}
                                    videoOutPoint={track.videoOutPoint}
                                    startOffset={track.trackStart}
                                    duration={track.duration}
                                    videoId={track.videoId}
                                    key={track.videoId}
                                    onTrim={(whichEnd, delta) => this.handleTrackTrim(track, whichEnd, delta)}
                                    onNudge={delta => this.handleTrackNudge(track, delta)}
                                    volume={track.volume}
                                    onVolumeChange={delta => this.handleTrackVolumeChange(track, delta)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    }
};