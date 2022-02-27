import { AlbersUsa } from '@visx/geo';
import { useEffect, useState } from 'react';
import './App.css';
import * as topojson from 'topojson-client';
import topology from './america.json'
import { scaleQuantile } from '@visx/scale';
import { geoAlbersUsa } from 'd3-geo';
import { LegendQuantile } from '@visx/legend';

function App() {
  const [active, setActive] = useState<null | number>(null);
  const [data, setData] = useState([]);
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

  const quantileScale = scaleQuantile({
    domain: [0, 25],
    range: ['#eb4d70', '#f19938', '#6ce18b', '#78f6ef', '#9096f8'].reverse(),
  });



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
          {data.map((station: any, i) => {
            const coords: [number, number] = [station.coordinates.longitude, station.coordinates.latitude];
            const pm25 = station.parameters.find((param: any) => param.parameter === 'pm25');
            return <circle
              onMouseOver={() => setActive(i)}
              key={i}
              r={6}
              opacity={0.9}
              fill={pm25 ? quantileScale(pm25.lastValue) : '#ffffff50'}
              transform={`translate(${projection(coords)})`}
            />

          })}
        </g>
      </svg>
      <LegendQuantile scale={quantileScale} />
    </div>
  );
}

export default App;
