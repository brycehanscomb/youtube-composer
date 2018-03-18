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

export function getWidth(duration, zoom) {
    const seconds = duration / 1000;
    return Math.floor(seconds) * zoomCoefficients[zoom];
}