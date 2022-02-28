import { AnimatedAxis, AnimatedLineSeries, darkTheme, Tooltip, XYChart } from "@visx/xychart";
import { filterDetails } from "../utils/util";

export default function LineChart(props: { data: any, pm25: boolean, pm10: boolean, so2: boolean, no2: boolean, co: boolean, o3: boolean }) {

    const width = 800;
    const height = 600;
    const pm25Data: any = filterDetails(props.data, 'pm25');
    const pm10Data: any = filterDetails(props.data, 'pm10');
    const so2Data: any = filterDetails(props.data, 'so2');
    const no2Data: any = filterDetails(props.data, 'no2');
    const coData: any = filterDetails(props.data, 'co');
    const o3Data: any = filterDetails(props.data, 'o3');

    const accessors = {
        xAccessor: (d: any) => new Date(d.date.utc),
        yAccessor: (d: any) => d.value,
    }


    return (
        <XYChart theme={darkTheme} height={height} width={width} xScale={{ type: "band", reverse: true }} yScale={{ type: 'linear', nice: true }}>
            <AnimatedAxis orientation="bottom" label="Time" tickComponent={() => null} />
            <AnimatedAxis orientation="left" label="Concentration" />
            {props.pm25 && <AnimatedLineSeries dataKey="pm25" data={pm25Data} {...accessors} />}
            {props.pm10 && <AnimatedLineSeries dataKey="pm10" data={pm10Data} {...accessors} />}
            {props.so2 && <AnimatedLineSeries dataKey="so2" data={so2Data} {...accessors} />}
            {props.no2 && <AnimatedLineSeries dataKey="no2" data={no2Data} {...accessors} />}
            {props.o3 && <AnimatedLineSeries dataKey="o3" data={o3Data} {...accessors} />}
            {props.co && <AnimatedLineSeries dataKey="co" data={coData} {...accessors} />}
            <Tooltip
                snapTooltipToDatumX
                snapTooltipToDatumY
                showVerticalCrosshair
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

