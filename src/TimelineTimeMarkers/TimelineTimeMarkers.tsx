import * as React from 'react';
import { range } from 'lodash';
import seconds2timecode from 'seconds2timecode';

import './style.css';

export default function TimelineTimeMarkers(props : any) {
    return (
        <>
            {range(0, 10, 1).map(markerTime => {
                return (
                    <span key={markerTime} style={{left: `${markerTime * 100}px`}} className="Timeline__TimeMarker">
                        {seconds2timecode(markerTime,3)}
                    </span>
                );
            })}
        </>
    )
}