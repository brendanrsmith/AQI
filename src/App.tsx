import { AlbersUsa } from '@visx/geo';
import React from 'react';
import './App.css';
import * as topojson from 'topojson-client';
import topology from './america.json'

function App() {
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

  return (
    <div className="App">
      <svg width={width} height={height}>
        <AlbersUsa data={usa} />
      </svg>
    </div>
  );
}

export default App;
