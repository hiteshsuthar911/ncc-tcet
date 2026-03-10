import { X, Megaphone, AlertTriangle, CheckCircle } from 'lucide-react'
import { useNotification } from '../context/NotificationContext'

const STYLES = {
  info:    { bar: 'bg-army-950 border-gold-700',    text: 'text-gold-200',   Icon: Megaphone,     iconCls: 'text-gold-400'  },
  warning: { bar: 'bg-red-950 border-red-800',      text: 'text-red-200',    Icon: AlertTriangle, iconCls: 'text-red-400'   },
  success: { bar: 'bg-green-950 border-green-800',  text: 'text-green-200',  Icon: CheckCircle,   iconCls: 'text-green-400' },
}

export default function NotificationBar() {
  const { notif, isActive, dismiss } = useNotification()
  if (!isActive || !notif) return null

  const { bar, text, Icon, iconCls } = STYLES[notif.type || 'info'] ?? STYLES.info

  return (
    <div className={`fixed top-0 left-0 right-0 z-[70] h-10 border-b ${bar} flex items-center px-4 gap-3`}>
      <Icon className={`w-4 h-4 flex-shrink-0 ${iconCls}`} />
      <p className={`flex-1 min-w-0 font-body text-xs sm:text-sm truncate ${text}`}>
        {notif.message}
      </p>
      {notif.link && (
        <a
          href={notif.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-heading text-xs uppercase tracking-wider underline underline-offset-2 flex-shrink-0 ${text}`}
        >
          Details
        </a>
      )}
      <button onClick={dismiss} className={`flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ${text}`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
