import * as React from 'react';
import * as interact from 'interactjs';

import {getMilliSecondsFromPixelWidth, getWidth} from "../utils";

export default class TimelinePlayhead extends React.Component<any, any> {
    private rootNode : HTMLElement | null;

    componentDidMount() {
        if (!this.rootNode) {
            return;
        }

        interact(this.rootNode)
            .draggable({ axis: 'x' })
            .on('dragmove', this.onDragMove);
    }

    onDragMove = (event : Interact.InteractEvent) => {
        const deltaTime = getMilliSecondsFromPixelWidth(event.dx, this.props.zoom);
        this.props.onMove(deltaTime);
    };

    componentWillUnmount() {
        if (!this.rootNode) {
            return;
        }

        interact(this.rootNode).unset();
    }

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