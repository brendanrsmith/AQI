import { MouseEventHandler, useEffect, useState } from "react";
import LineChart from "./line-chart";

export default function Details(props: { station: any, onClick: MouseEventHandler<HTMLDivElement> | undefined }): JSX.Element {
    const [details, setDeatils] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


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
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', height: '90vh', width: '100%', background: '#111', borderRadius: 6, overflow: 'scroll' }} onClick={props.onClick}>
            <div>
                {props.station.name}, {props.station.city}
            </div>
            <div>
                {isLoading ?
                    <div>loading...</div> :
                    <LineChart data={details} />
                }
            </div>
        </div>
    )
} 