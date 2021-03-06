import * as React from 'react';
import {clamp} from 'lodash';
import './App.css';
import Timeline from "../Timeline/Timeline";
import {getVideoDuration} from "../MetaGatherer";
import WaitFor from "../WaitFor/WaitFor";
import Preview from "../Preview/Preview";

export interface EditorTrack {
    videoId: string,
    videoInPoint: number,
    trackStart: number,
    duration: number,
    videoOutPoint: number,
    volume: number
}

export default class App extends React.Component<any, {
    tracks: Array<EditorTrack>,
    playheadPosition: number,
    isPlaying: boolean
}> {
    state = {
        tracks: [
            {
                videoId: '-5-K51jHQ6k',
                videoInPoint: 68000,
                trackStart: 0,
                duration: -1,
                videoOutPoint: 80500,
                volume: 70
            },
            {
                videoId: '04854XqcfCY',
                videoInPoint: 34000,
                trackStart: 12000,
                duration: -1,
                videoOutPoint: 46500,
                volume: 100
            }
        ],
        playheadPosition: 0,
        isPlaying: false
    };

    componentDidMount() {
        if (this.state.tracks.length) {
            Promise.all(
                this.state.tracks
                    .map(track => {
                        return track.videoId;
                    })
                    .map(getVideoDuration)
            ).then((durations: Array<number>) => {
                this.setState({
                    tracks: this.state.tracks.map((track, index) => {
                        return {
                            ...track,
                            duration: durations[index],
                            videoOutPoint: track.videoOutPoint === -1
                                ? durations[index] - track.videoInPoint
                                : track.videoOutPoint
                        };
                    })
                })
            });
        }
    }

    areDurationsReady = () => {
        return this.state.tracks.every(
            track => track.duration !== -1
        );
    };

    onTrackNudge = (track, delta : number) => {
        this.setState({
            tracks: this.state.tracks.map(it => {
                if (it !== track) {
                    return it;
                } else {
                    const newValue = it.trackStart + delta;

                    return {
                        ...track,
                        trackStart: Math.max(0, newValue)
                    };
                }
            })
        });
    };

    onTrackVolumeChange = (track, delta : number) => {
        this.setState({
            tracks: this.state.tracks.map(it => {
                if (it !== track) {
                    return it;
                } else {
                    const newValue = it.volume + delta;

                    return {
                        ...track,
                        volume: clamp(newValue, 0, 100)
                    };
                }
            })
        });
    };

    onTrimStart = (track, delta : number) => {
        this.setState({
            tracks: this.state.tracks.map(it => {
                if (it !== track) {
                    return it;
                } else {
                    const newInPoint = it.videoInPoint + delta;
                    const newTrackStart = it.trackStart + delta;

                    if (newInPoint < 0) {
                        const distanceFromZero = 0 - newInPoint;
                        const canTakeFromRightCrop = track.videoOutPoint < track.duration;

                        if (canTakeFromRightCrop) {
                            return {
                                ...track,
                                videoOutPoint: track.videoOutPoint + distanceFromZero,
                                trackStart: newTrackStart - (delta + distanceFromZero)
                            };
                        } else {
                            return {
                                ...track,
                                videoInPoint: 0,
                                trackStart: newTrackStart + distanceFromZero
                            };
                        }
                    }

                    return {
                        ...track,
                        videoInPoint: Math.max(0, newInPoint),
                        trackStart: Math.max(0, newTrackStart)
                    };
                }
            })
        });
    };

    onTrimEnd = (track, delta : number) => {
        this.setState({
            tracks: this.state.tracks.map(it => {
                if (it !== track) {
                    return it;
                } else {
                    const newOutPoint = it.videoOutPoint + delta;

                    // if (newOutPoint < 0) {
                    //     const distanceFromZero = 0 - newOutPoint;
                    //     const canTakeFromRightCrop = track.videoOutPoint < track.duration;
                    //
                    //     if (canTakeFromRightCrop) {
                    //         return {
                    //             ...track,
                    //             videoOutPoint: track.videoOutPoint + distanceFromZero,
                    //             trackStart: newTrackStart - (delta + distanceFromZero)
                    //         };
                    //     } else {
                    //         return {
                    //             ...track,
                    //             videoOutPoint: 0,
                    //             trackStart: newTrackStart + distanceFromZero
                    //         };
                    //     }
                    // }

                    return {
                        ...track,
                        videoOutPoint: Math.min(track.duration, newOutPoint)
                    };
                }
            })
        });
    };

    handlePlayheadPositionChange = (delta : number, shouldBePlaying : boolean = this.state.isPlaying) : void => {
        this.setState({
            playheadPosition: this.state.playheadPosition + delta,
            isPlaying: shouldBePlaying
        });
    };

    render() {
        return (
            <div className="App">
                <header>Header</header>
                <div className="middle">
                    <WaitFor when={this.areDurationsReady()}>
                        <Preview
                            time={this.state.playheadPosition}
                            tracks={this.state.tracks}
                            isPlaying={this.state.isPlaying}
                        />
                    </WaitFor>
                </div>
                <WaitFor when={this.areDurationsReady()}>
                    <Timeline
                        onPlayheadMove={this.handlePlayheadPositionChange}
                        playheadPosition={this.state.playheadPosition}
                        tracks={this.state.tracks}
                        onTrimStart={this.onTrimStart}
                        onTrimEnd={this.onTrimEnd}
                        onTrackNudge={this.onTrackNudge}
                        onTrackVolumeChange={this.onTrackVolumeChange}
                    />
                </WaitFor>
            </div>
        );
    }
}