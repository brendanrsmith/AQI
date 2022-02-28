import { GlyphCircle, GlyphSquare, GlyphTriangle } from "@visx/glyph";
import { scaleOrdinal, scaleQuantile } from "@visx/scale";

export const pm25Scale = scaleQuantile({
    reverse: true,
    domain: [0, 25],
    range: ['#eb4d70', '#f19938', '#6ce18b', '#78f6ef', '#9096f8'],
});
export const pm10Scale = scaleQuantile({
    reverse: true,
    domain: [0, 244],
    range: ['#eb4d70', '#f19938', '#6ce18b', '#78f6ef', '#9096f8'],
});
export const no2Scale = scaleQuantile({
    reverse: true,
    domain: [0, 0.1],
    range: ['#eb4d70', '#f19938', '#6ce18b', '#78f6ef', '#9096f8'],
});
export const coScale = scaleQuantile({
    reverse: true,
    domain: [0, 1],
    range: ['#eb4d70', '#f19938', '#6ce18b', '#78f6ef', '#9096f8'],
});
export const so2Scale = scaleQuantile({
    reverse: true,
    domain: [0, 0.075],
    range: ['#eb4d70', '#f19938', '#6ce18b', '#78f6ef', '#9096f8'],
});
export const o3Scale = scaleQuantile({
    reverse: true,
    domain: [0, 0.07],
    range: ['#eb4d70', '#f19938', '#6ce18b', '#78f6ef', '#9096f8'],
});

export const glyphScale = scaleOrdinal({
    domain: ['government', 'research', 'community'],
    range: [
        <GlyphCircle key='government' size={50} top={50 / 6} left={50 / 6} fill="#eee" />,
        <GlyphTriangle key="research" size={50} top={50 / 6} left={50 / 6} fill="#eee" />,
        <GlyphSquare key="community" size={50} top={50 / 6} left={50 / 6} fill="#eee" />,
    ]
})

export const fillColor = (pollutant: any, activePollutant: any) => {
    if (!pollutant) {
        return '#ffffff50';
    } else {
        return activePollutant.scale(pollutant.lastValue);
    }
}

export const filterDetails = (details: any, pollutant: string) => {
    return details.filter((datum: any) => {
        return datum.parameter === pollutant;
    })
}