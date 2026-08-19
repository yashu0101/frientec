export default function Toast({ message }) {
  return <div id="toast" className={message ? 'on' : ''}>{message}</div>;
}
