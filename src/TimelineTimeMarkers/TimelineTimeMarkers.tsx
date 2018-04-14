import * as React from 'react';
import { range } from 'lodash';

import './style.css';
import {getWidth} from "../utils";

export default function TimelineTimeMarkers(props : any) {
    const widthOfSecond = getWidth(1000, props.zoom);
    return (
        <>
            {range(0, 20, 1).map((markerTime, index) => {
                return (
                    <span key={markerTime} style={{left: `${widthOfSecond * index}px`}} className="Timeline__TimeMarker">
                        00:{markerTime > 9 ? markerTime : '0' + markerTime}
                    </span>
                );
            })}
        </>
    )
}