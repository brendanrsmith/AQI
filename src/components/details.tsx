import { MouseEventHandler, useEffect, useState } from "react";
import { filterDetails } from "../utils/util";
import LineChart from "./line-chart";

export default function Details(props: { station: any, onClick: MouseEventHandler<HTMLDivElement> | undefined }): JSX.Element {
    const [details, setDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pm25, setPm25] = useState(true);
    const [pm10, setPm10] = useState(true);
    const [so2, setSo2] = useState(true);
    const [co, setCo] = useState(true);
    const [no2, setNo2] = useState(true);
    const [o3, setO3] = useState(true);

    const measurements = {
        pm25: filterDetails(details, 'pm25'),
        pm10: filterDetails(details, 'pm10'),
        so2: filterDetails(details, 'so2'),
        no2: filterDetails(details, 'no2'),
        co: filterDetails(details, 'co'),
        o3: filterDetails(details, 'o3'),
    }

    const measurementCounts = {
        pm25: measurements.pm25.length,
        pm10: measurements.pm10.length,
        so2: measurements.so2.length,
        co: measurements.co.length,
        no2: measurements.no2.length,
        o3: measurements.o3.length
    }
    const setDisplay = {
        pm25: [pm25, setPm25],
        pm10: [pm10, setPm10],
        so2: [so2, setSo2],
        co: [co, setCo],
        no2: [no2, setNo2],
        o3: [o3, setO3],
    }
    const activeMeasurements = (Object.entries(measurementCounts).filter(m => m[1] > 0).map(m => m[0]));
    useEffect(() => {
        setIsLoading(true);
        fetch(`https://api.openaq.org/v2/measurements?date_from=2000-01-01T00%3A00%3A00%2B00%3A00&date_to=${new Date().toJSON()}&limit=100&page=1&offset=0&sort=desc&radius=1000&location_id=${props.station.id}&order_by=datetime`)
        .then(res => {
            if(res.status !== 200){
                 throw res.status;
            }
            return res;
        })
        .then(response => response.json())
        .then(data => {
            setDetails(data.results);
        }).finally(() => {
            setIsLoading(false);
        }).catch(error => {
            alert('api error: ' + error);
        });
    }, [props.station.id])
    
    return (
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', height: '90vh', width: '90vw', background: '#111', borderRadius: 6, overflow: 'scroll', padding: 5 }}>
            <div style={{ justifyContent: 'space-between', flexDirection: 'row', display: "flex", paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div style={{ cursor: 'pointer' }} onClick={props.onClick}>x</div>
                <div>
                    <div>
                        {props.station.name} {props.station.city}
                    </div>
                    <div style={{ fontSize: '14px' }}>
                        Last updated: {new Date(props.station.lastUpdated).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '14px' }}>
                        Sensor type: {props.station.sensorType}
                    </div>
                    <div style={{ fontSize: '14px' }}>
                        Parameters: {activeMeasurements.join(', ')}
                    </div>
                </div>
                <div style={{ display: "flex" }}>

                    <div style={{ fontSize: '14px', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                        {Object.entries(measurements).map(measurement => {
                            const title = measurement[0];
                            const hasData = measurementCounts[title];
                            return hasData ? (
                                <div style={{ alignItems: "center", justifyContent: 'center', paddingBottom: '2px' }}>
                                    <input type="checkbox" id={title} name={title} onChange={() => setDisplay[title][1](!setDisplay[title][0])} value={measurement[0]} defaultChecked
                                    />
                                    <label htmlFor={title}>{title}</label>
                                </div>
                            ) : (undefined)
                        })}
                    </div>

                </div>

            </div>

            <div>
                {isLoading ?
                    <div>loading...</div> :
                    <LineChart data={measurements} pm25={pm25} pm10={pm10} so2={so2} no2={no2} co={co} o3={o3} />
                }
            </div>
        </div>
    )
} 