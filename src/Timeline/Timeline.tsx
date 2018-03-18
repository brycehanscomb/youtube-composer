import * as React from 'react';
import './Timeline.css';
import TimelineTrack from "../TimelineTrack/TimelineTrack";

interface IState {
    zoom: number
}

export default class Timeline extends React.Component<any, IState> {
    state = {
        zoom: 0
    };

    onZoomChanged = (event : React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            zoom: parseInt(event.target.value)
        });
    };

    render() {
        return (
            <div className="Timeline">
                <div className="Timeline__Controls">
                    <button>
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
                    <div className="Timeline__Tracks">
                        <div className="Timeline__Header">

                        </div>
                        {this.props.tracks.map(track => {
                            return (
                                <TimelineTrack
                                    zoom={this.state.zoom}
                                    duration={track.duration}
                                    videoId={track.videoId}
                                    key={track.videoId}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    }
};