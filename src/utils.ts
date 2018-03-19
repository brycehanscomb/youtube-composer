// pixels per second
export const zoomCoefficients = {
    '-6': 1,
    '-5': 2,
    '-3': 4,
    '-2': 8,
    '-1': 16,
    '0': 32,
    '1': 64,
    '2': 100,
    '3': 150,
    '4': 200,
    '5': 350,
    '6': 500
};

export function getWidth(duration : number, zoom) : number {
    return (duration * zoomCoefficients[zoom]) / 1000;
}

export function getMilliSecondsFromPixelWidth(pixels : number, zoom) : number {
    return (pixels / zoomCoefficients[zoom]) * 1000;
}