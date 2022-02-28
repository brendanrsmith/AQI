import { AlbersUsa } from '@visx/geo';
import { useEffect, useState } from 'react';
import './App.css';
import * as topojson from 'topojson-client';
import topology from './america.json'
import { geoAlbersUsa } from 'd3-geo';
import { Legend, LegendItem, LegendLabel, LegendQuantile } from '@visx/legend';
import MapLegend from './components/map-legend';
import Tooltip from './components/tooltip';
import { coScale, fillColor, glyphScale, no2Scale, o3Scale, pm10Scale, pm25Scale, so2Scale } from './utils/util';
import Details from './components/details';
import { GlyphCircle, GlyphSquare, GlyphTriangle } from '@visx/glyph';
import React from 'react';
import { Text } from '@visx/text';


export const pollutants: Record<string, { name: string, unit: string, scale: any }> = {
  pm25: { name: 'pm25', unit: "µg/m³", scale: pm25Scale },
  pm10: { name: 'pm10', unit: "µg/m³", scale: pm10Scale },
  co: { name: 'co', unit: "ppm", scale: coScale },
  no2: { name: 'no2', unit: "ppm", scale: no2Scale },
  so2: { name: 'so2', unit: "ppm", scale: so2Scale },
  o3: { name: 'o3', unit: "ppm", scale: o3Scale },
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeStation, setActiveStation] = useState<null | number>(null);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [pollutant, setPollutant] = useState('pm25');
  const [entity, setEntity] = useState<string>('null');
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

  const Glyphs = {
    government: GlyphCircle,
    research: GlyphTriangle,
    community: GlyphSquare
  }

  //https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?limit=500&page=1&offset=0&sort=desc&country_id=US&order_by=random&entity=community 

  useEffect(() => {
    setIsLoading(true);
    const query = entity === 'null' ?
      `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?limit=1000&page=1&offset=0&sort=desc&radius=1000&country_id=US&dumpRaw=false`
      : `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?limit=1000&page=1&offset=0&sort=desc&radius=1000&country_id=US&entity=${entity}&dumpRaw=false`;
    fetch(query).then(response => response.json())
      .then(data => {
        setData(data.results);
      }).catch(() => {
        alert('Something went wrong.')
      }).finally(() => {
        setIsLoading(false);
      });

  }, [entity]);

  return (
    <>
      <div className="App">
        {selectedStation &&
          <Details
            station={selectedStation}
            onClick={() => setSelectedStation(null)}
          />}
        <div>AQI Explorer</div>
        <svg width={width} height={height}>
          <AlbersUsa data={usa} />
          {isLoading ? <Text
            width={width / 6}
            fill={'#fff'}
            verticalAnchor="start"
            scaleToFit
            dy={250}
            z={100}
            dx={500}
          >
            Loading...
          </Text> :
            <g>
              {data.map((station: any, i: number) => {
                const coords: [number, number] = [station.coordinates?.longitude, station.coordinates?.latitude];
                const pollutant = station.parameters.find((param: any) => param.parameter === activePollutant.name);
                const entity = station.entity;
                const CurrGlyph = Glyphs[entity];

                return <CurrGlyph
                  onMouseOver={() => setActiveStation(i)}
                  onMouseOut={() => setActiveStation(null)}
                  onClick={() => setSelectedStation(station)}
                  key={i}
                  size={activeStation === i ? 160 : 100}
                  opacity={activeStation === i ? 1 : .6}
                  fill={fillColor(pollutant, activePollutant)}
                  transform={`translate(${projection(coords)})`}
                />

              })}
            </g>}
        </svg>
        <MapLegend
          title={activePollutant.unit}
          selectPollutant={(e: any) => {
            e.preventDefault();
            setPollutant(e.target.value);
          }}
          selectEntity={(e: any) => {
            e.preventDefault();
            setEntity(e.target.value);
          }}
          children={<div>
            <LegendQuantile labelFormat={(i: any) => Math.round(i * 100) / 100} scale={activePollutant.scale} />
            <Legend scale={glyphScale}>
              {(labels) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {labels.map((label, i) => {
                    const color = '#fff';
                    const shape = glyphScale(label.datum);
                    const isValidElement = React.isValidElement(shape);
                    return (
                      <LegendItem
                        key={`legend-quantile-${i}`}
                        flexDirection="row"
                        alignItems='center'
                      >
                        <svg
                          width={24}
                          height={16}
                        >
                          {isValidElement
                            ? React.cloneElement(shape as React.ReactElement)
                            : React.createElement(shape as unknown as React.ComponentType<{ fill: string }>, {
                              fill: color,
                            })}
                        </svg>
                        <LegendLabel align="left" margin={0}>
                          {label.text}
                        </LegendLabel>
                      </LegendItem>
                    );
                  })}
                </div>
              )}
            </Legend>
          </div>}
        />
        <div style={{ width: 300, margin: 'auto' }}>
          {activeStation && <Tooltip d={data[activeStation]} />
          }
        </div>
      </div>
    </>

  );
}
