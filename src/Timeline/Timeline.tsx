import * as React from 'react';
import './Timeline.css';
import TimelineTrack from "../TimelineTrack/TimelineTrack";
import {getWidth} from "../utils";
import TimelinePlayhead from "../TimelinePlayhead/TimelinePlayhead";

interface IState {
    zoom: number,
    playheadPosition: number
}

export default class Timeline extends React.Component<any, IState> {
    state = {
        zoom: 0,
        playheadPosition: 0
    };

    private tracksEl : HTMLElement | null;

    private playTimer;

    play = () => {
        this.setState({
            playheadPosition: this.state.playheadPosition + 333
        });

        this.keepPlayheadInView();

        this.playTimer = setTimeout(this.play, 333);
    };

    stop = () => {
        clearTimeout(this.playTimer);
        this.playTimer = null;
        this.keepPlayheadInView();
    };

    keepPlayheadInView = () => {
        if (!this.tracksEl || !this.tracksEl.parentElement) {
            return;
        }

        const rightPosOfTimeline = this.getTimelineWidth() + this.tracksEl.parentElement.scrollLeft;
        const playheadPosition = this.getPlayheadPosition();

        if (playheadPosition > rightPosOfTimeline) {
            this.tracksEl.parentElement.scrollLeft = playheadPosition - (this.getTimelineWidth() / 3);
        }
    };

    onZoomChanged = (event : React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            zoom: parseInt(event.target.value)
        });
    };

    getPlayheadPosition = () => {
        return getWidth(this.state.playheadPosition, this.state.zoom);
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

    render() {
        return (
            <div className="Timeline">
                <div className="Timeline__Controls">
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
                                currentTime={this.state.playheadPosition}
                                zoom={this.state.zoom}
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
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    }
};