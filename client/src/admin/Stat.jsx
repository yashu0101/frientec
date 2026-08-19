/* The count-up hook finds these by class, so the markup stays as it was. */
export default function Stat({ label, value, count, prefix, color }) {
  return (
    <div className="card" style={{ padding: '16px' }}>
      <div className="mono dim" style={{ marginBottom: '8px' }}>{label}</div>
      <div className="disp stat" data-count={count} data-prefix={prefix || ''} style={{ fontSize: '26px', color }}>
        {value}
      </div>
    </div>
  );
}
