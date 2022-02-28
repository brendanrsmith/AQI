import { MouseEventHandler, useEffect, useState } from "react";
import LineChart from "./line-chart";

export default function Details(props: { station: any, onClick: MouseEventHandler<HTMLDivElement> | undefined }): JSX.Element {
    const [details, setDeatils] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pm25, setPm25] = useState(true);
    const [pm10, setPm10] = useState(true);
    const [so2, setSo2] = useState(false);
    const [co, setCo] = useState(false);
    const [no2, setNo2] = useState(false);
    const [o3, setO3] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        fetch(`https://docs.openaq.org/v2/measurements?date_from=2021-01-01T00%3A00%3A00%2B00%3A00&date_to=2022-02-27T21%3A11%3A00%2B00%3A00&limit=100&page=1&offset=0&sort=desc&radius=1000&location_id=${props.station.id}&order_by=datetime`).then(response => response.json())
            .then(data => {
                console.log(data);
                setDeatils(data.results);
            }).finally(() => {
                setIsLoading(false);
            });
    }, [props.station.id])


    return (
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', height: '90vh', width: '100%', background: '#111', borderRadius: 6, overflow: 'scroll', padding: 5 }}>
            <div style={{ justifyContent: 'space-between', flexDirection: 'row', display: "flex", paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div style={{ cursor: 'pointer' }} onClick={props.onClick}>x</div>
                <div>
                    {props.station.name} {props.station.city}
                </div>
                <div style={{ display: "flex" }}>

                    <div style={{ fontSize: '14px', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ alignItems: "center", justifyContent: 'center', paddingBottom: '2px' }}>
                            <input type="checkbox" id="pm25" name="pm25" onChange={() => setPm25(!pm25)} value={'pm25'} defaultChecked
                            />
                            <label htmlFor="pm25">pm25</label>
                        </div>
                        <div style={{ alignItems: "center", justifyContent: 'center', paddingBottom: '2px' }}>
                            <input type="checkbox" id="pm10" name="pm10" onChange={() => setPm10(!pm10)} value={'pm10'} defaultChecked
                            />
                            <label htmlFor="pm10">pm10</label>
                        </div>
                        <div style={{ alignItems: "center", justifyContent: 'center', paddingBottom: '2px' }}>
                            <input type="checkbox" id="so2" name="so2" onChange={() => setSo2(!so2)} value={'so2'}
                            />
                            <label htmlFor="so2">so2</label>
                        </div>
                    </div>

                    <div style={{ fontSize: '14px', alignItems: 'flex-start', display: 'flex', flexDirection: 'column' }}>

                        <div style={{ alignItems: "center", justifyContent: 'center', paddingBottom: '2px' }}>
                            <input type="checkbox" id="co" name="co" onChange={() => setCo(!co)} value={'co'}
                            />
                            <label htmlFor="co">co</label>
                        </div>
                        <div style={{ alignItems: "center", justifyContent: 'center', paddingBottom: '2px' }}>
                            <input type="checkbox" id="no2" name="no2" onChange={() => setNo2(!no2)} value={'no2'}
                            />
                            <label htmlFor="no2">no2</label>
                        </div>
                        <div style={{ alignItems: "center", justifyContent: 'center', paddingBottom: '2px' }}>
                            <input type="checkbox" id="o3" name="o3" onChange={() => setO3(!o3)} value={'o3'}
                            />
                            <label htmlFor="o3">o3</label>
                        </div>
                    </div>
                </div>

            </div>

            <div>
                {isLoading ?
                    <div>loading...</div> :
                    <LineChart data={details} pm25={pm25} pm10={pm10} so2={so2} no2={no2} co={co} o3={o3} />
                }
            </div>
        </div>
    )
} 