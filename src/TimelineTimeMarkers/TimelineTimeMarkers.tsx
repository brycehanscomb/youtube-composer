import * as React from 'react';
import { range } from 'lodash';

import './style.css';

export default function TimelineTimeMarkers(props : any) {
    return (
        <>
            {range(0, 10, 1).map(markerTime => {
                return (
                    <span key={markerTime} style={{left: `${markerTime * 100}px`}} className="Timeline__TimeMarker">
                        00:0{markerTime}
                    </span>
                );
            })}
        </>
    )
}