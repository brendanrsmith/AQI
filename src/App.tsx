import { AlbersUsa } from '@visx/geo';
import { useEffect, useState } from 'react';
import './App.css';
import * as topojson from 'topojson-client';
import topology from './america.json'
import { geoAlbersUsa } from 'd3-geo';
import { LegendQuantile } from '@visx/legend';
import MapLegend from './components/map-legend';
import Tooltip from './components/tooltip';
import { coScale, fillColor, no2Scale, o3Scale, pm10Scale, pm25Scale, so2Scale } from './utils/util';


const pollutants: Record<string, { name: string, unit: string, scale: any }> = {
  pm25: { name: 'pm25', unit: "µg/m³", scale: pm25Scale },
  pm10: { name: 'pm10', unit: "µg/m³", scale: pm10Scale },
  co: { name: 'co', unit: "ppm", scale: coScale },
  no2: { name: 'no2', unit: "ppm", scale: no2Scale },
  so2: { name: 'so2', unit: "ppm", scale: so2Scale },
  o3: { name: 'o3', unit: "ppm", scale: o3Scale },
}

export default function App() {
  const [active, setActive] = useState<null | number>(null);
  const [data, setData] = useState<any>([]);
  const [pollutant, setPollutant] = useState('pm25');
  const activePollutant = pollutants[pollutant];
  const projection = geoAlbersUsa();
  const width = 1000;
  const height = 500;

  interface FeatureShape {
    type: 'Feature';
    id: string;
    geometry: { coordinates: [number, number][][]; type: 'Polygon' };
    properties: { name: string };
  }

  // @ts-ignore
  const { features: usa } = topojson.feature(topology, topology.objects.states) as {
    type: 'FeatureCollection';
    features: FeatureShape[];
  };



  useEffect(() => {
    fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?limit=500&page=1&offset=0&sort=desc&radius=1000&country_id=US&order_by=random&dumpRaw=false').then(response => response.json())
      .then(data => {
        console.log(data);
        setData(data.results);
      });

  }, []);

  return (
    <div className="App">
      <svg width={width} height={height}>
        <AlbersUsa data={usa} />
        <g>
          {data.map((station: any, i: number) => {
            const coords: [number, number] = [station.coordinates.longitude, station.coordinates.latitude];
            const pollutant = station.parameters.find((param: any) => param.parameter === activePollutant.name);
            return <circle
              onMouseOver={() => setActive(i)}
              onMouseOut={() => setActive(null)}
              key={i}
              r={active === i ? 10 : 6}
              opacity={active === i ? 1 : .6}
              fill={fillColor(pollutant, activePollutant)}
              transform={`translate(${projection(coords)})`}
            />

          })}
        </g>
      </svg>
      <MapLegend
        title={activePollutant.unit}
        children={<LegendQuantile labelFormat={(i: any) => Math.round(i * 100) / 100} scale={activePollutant.scale} />}
        onSelect={(e: any) => {
          e.preventDefault();
          setPollutant(e.target.value);
        }} />
      <div>
        {active && <Tooltip d={data[active]} />
        }
      </div>
    </div>

  );
}
