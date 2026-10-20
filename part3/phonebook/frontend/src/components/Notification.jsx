export default function Notification({ notification }) {
  if (!notification) return null
  return <div className={`notice ${notification.type === 'error' ? 'error' : ''}`} role={notification.type === 'error' ? 'alert' : 'status'}>{notification.message}</div>
}
