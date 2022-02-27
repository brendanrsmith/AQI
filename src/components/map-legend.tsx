export default function MapLegend({ title, children, onSelect }: { title: string, children: React.ReactNode, onSelect: (e: any) => void }) {
  return (
    <div className='legend'>
      <select onChange={(e) => {
        e.preventDefault();
        onSelect(e);
      }} style={{ background: '#282c34', color: '#fff', padding: 3, borderRadius: 4, marginBottom: 10 }} name="pollutant" id="pollutant">
        <option value={'pm25'}>pm2.5</option>
        <option value={'pm10'}>pm10</option>
        <option value={'so2'}>SO2</option>
        <option value={'o3'}>O3</option>
        <option value={'co'}>CO</option>
        <option value={'no2'}>NO2</option>
      </select>

      <div className='title'>{title}</div>
      {children}
      <div style={{ fontSize: 10, color: 'grey' }}>Sources without data are shown in grey.</div>
      <style>{`
        .legend {
          font-size: 12px;
          padding: 10px 10px;
          float: right;
          border-radius: 8px;
          margin: 5px 5px;
          width: 100px;
        }
        .title {
          font-size: 12px;
          margin-bottom: 10px;
        }
      `}</style>
    </div >
  )
}