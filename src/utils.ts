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

export function getWidth(duration : number, zoom, useMsPrecision : boolean = false) : number {
    if (useMsPrecision) {
        return duration * zoomCoefficients[zoom];
    } else {
        const seconds = duration / 1000;
        return Math.floor(seconds) * zoomCoefficients[zoom];
    }

}

export function getMsFromPixelWidth(pixels : number, zoom) : number {
    return pixels / zoomCoefficients[zoom];
}