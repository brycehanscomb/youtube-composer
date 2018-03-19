import * as React from 'react';
import {getWidth} from "../utils";

export default class TimelinePlayhead extends React.Component<any, any> {
    private rootNode : HTMLElement | null;

    componentDidUpdate() {
        if (!this.rootNode) {
            return;
        }

        const xPos = getWidth(this.props.currentTime, this.props.zoom);
        this.rootNode.style.left = `${xPos}px`;
    }

    render() {
        return (
            <div
                className="Timeline__Playhead"
                ref={el => this.rootNode = el}
            />
        );
    }
}