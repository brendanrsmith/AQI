import { MouseEventHandler, useEffect, useState } from "react";

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

    console.log(details);

    return (
        <div style={{ position: 'absolute', height: '90vh', width: '100%', background: 'pink', borderRadius: 6 }} onClick={props.onClick}>
            <div>
                {props.station.name}, {props.station.city}
            </div>
            <div>
                {isLoading ?
                    <div>loading...</div> :
                    details.map((datum: any) => {
                        return <div>{datum.date.utc}</div>;
                    })
                }
            </div>
        </div>
    )
} 