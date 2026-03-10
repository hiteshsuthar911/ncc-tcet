import { createContext, useContext, useState, useEffect } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    async function fetchNotif() {
      try {
        const snap = await getDoc(doc(db, 'settings', 'notification'))
        if (snap.exists() && snap.data().isActive) {
          const data = snap.data()
          const dismissKey = `notif_${data.updatedAt?.seconds ?? 'v0'}`
          if (!sessionStorage.getItem(dismissKey)) {
            setNotif({ ...data, dismissKey })
          }
        }
      } catch { /* network error — silently skip */ }
    }
    fetchNotif()
  }, [])

  function dismiss() {
    if (notif?.dismissKey) sessionStorage.setItem(notif.dismissKey, '1')
    setDismissed(true)
  }

  const isActive = !dismissed && !!notif

  return (
    <NotificationContext.Provider value={{ notif, isActive, dismiss }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}
