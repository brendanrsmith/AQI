
export default function Tooltip({ d }: any): JSX.Element {

    const paramFinder = (str: string, d: any) => {
        const params = (d.parameters?.find((p: { parameter: string; }) => p.parameter === str));
        if (params === undefined) {
            return undefined;
        } else {
            return params.lastValue;
        }
    }
    const params: Record<string, string> = {
        pm25: paramFinder('pm25', d) || ' - ',
        o3: paramFinder('o3', d) || ' - ',
        pm10: paramFinder('pm10', d) || ' - ',
        co: paramFinder('co', d) || ' - ',
        no2: paramFinder('no2', d) || ' - ',
        so2: paramFinder('so2', d) || ' - ',
    }

    return (
        <div className='wrapper'>
            <div>{d.name ?? 'unknown'}</div>
            <div>City: {d.city || 'unknown'}</div>
            <div>Entity: {d.entity || 'unknown'}</div>
            {Object.keys(params).map(param => {
                return <div key={param}>{`${param}: ${params[param]}`}</div>
            })}
            <style>{`
        .wrapper {
          font-size: 16px;
          padding: 10px 10px;
          border-radius: 8px;
          margin: 5px 5px;
        }
  `}</style>
        </div>

    )
}