import { AnimatedAxis, AnimatedLineSeries, darkTheme, Tooltip, XYChart } from "@visx/xychart";

export default function LineChart(props: { data: any, pm25: boolean, pm10: boolean, so2: boolean, no2: boolean, co: boolean, o3: boolean }) {

    const width = 800;
    const height = 600;
    const accessors = {
        xAccessor: (d: any) => new Date(d.date.utc),
        yAccessor: (d: any) => d.value,
    }

    return (
        <XYChart theme={darkTheme} height={height} width={width} xScale={{ type: "band", reverse: true }} yScale={{ type: 'linear', nice: true }}>
            <AnimatedAxis orientation="bottom" label="Time" tickComponent={() => null} />
            <AnimatedAxis orientation="left" label="Concentration" />
            {props.pm25 && <AnimatedLineSeries dataKey="pm25" data={props.data.pm25} {...accessors} />}
            {props.pm10 && <AnimatedLineSeries dataKey="pm10" data={props.data.pm10} {...accessors} />}
            {props.so2 && <AnimatedLineSeries dataKey="so2" data={props.data.so2} {...accessors} />}
            {props.no2 && <AnimatedLineSeries dataKey="no2" data={props.data.no2} {...accessors} />}
            {props.o3 && <AnimatedLineSeries dataKey="o3" data={props.data.o3} {...accessors} />}
            {props.co && <AnimatedLineSeries dataKey="co" data={props.data.co} {...accessors} />}
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

