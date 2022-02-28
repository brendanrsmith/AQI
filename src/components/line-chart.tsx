import { AnimatedAxis, AnimatedLineSeries, darkTheme, Tooltip, XYChart } from "@visx/xychart";
import { filterDetails } from "../utils/util";

export default function LineChart(props: { data: any }) {

    const width = 800;
    const height = 600;
    const pm25Data: any = filterDetails(props.data, 'pm25');
    const pm10Data: any = filterDetails(props.data, 'pm10');

    const accessors = {
        xAccessor: (d: any) => new Date(d.date.utc),
        yAccessor: (d: any) => d.value,
    }


    return (
        <XYChart theme={darkTheme} height={height} width={width} xScale={{ type: "band", reverse: true }} yScale={{ type: 'linear', nice: true }}>
            <AnimatedAxis orientation="bottom" label="Date" tickComponent={() => null} />
            <AnimatedAxis orientation="left" label="Concentration" />
            <AnimatedLineSeries dataKey="pm10" data={pm10Data} {...accessors} />
            <AnimatedLineSeries dataKey="pm25" data={pm25Data} {...accessors} />
            <Tooltip
                snapTooltipToDatumX
                snapTooltipToDatumY
                showVerticalCrosshair
                // showSeriesGlyphs
                renderTooltip={({ tooltipData, colorScale }) => (
                    <div>
                        <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
                            {tooltipData.nearestDatum.key}
                        </div>
                        {(tooltipData?.nearestDatum?.datum &&
                            accessors.xAccessor(tooltipData?.nearestDatum?.datum)).toLocaleString() ||
                            'No date'}
                        {', '}
                        {accessors.yAccessor(tooltipData.nearestDatum.datum)}
                    </div>
                )

                }
            />
        </XYChart >
    )
}

