export default function MapLegend({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className='legend'>
      <div className='title'>{title}</div>
      {children}
      <style>{`
        .legend {
          font-size: 12px;
          padding: 10px 10px;
          float: right;
          border-radius: 8px;
          margin: 5px 5px;
        }
        .title {
          font-size: 12px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  )
}