import { useState, useEffect } from 'react'
import { Download, X, Shield, Smartphone } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Don't show if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Delay showing to not be intrusive on first load
      setTimeout(() => setShow(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setShow(false)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setDeferredPrompt(null)
    setShow(false)
  }

  function dismiss() {
    setShow(false)
    // Don't re-show this session
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  if (!show || installed || sessionStorage.getItem('pwa-dismissed')) return null

  return (
    <div className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-5 sm:w-80 z-50 animate-slide-up">
      <div className="bg-military-darker border border-gold-700/60 shadow-2xl shadow-black/70 p-4 relative">
        {/* Gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-3 right-3 text-army-500 hover:text-army-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-5">
          <div className="w-11 h-11 bg-army-800 border border-gold-600/50 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-gold-400" />
          </div>
          <div className="flex-1">
            <p className="font-heading text-sm text-white uppercase tracking-wide leading-tight">
              Install NCC TCET App
            </p>
            <p className="text-army-400 font-body text-xs mt-1 leading-relaxed">
              Add to your home screen for quick access. Works offline too.
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5 flex-1 justify-center"
              >
                <Download className="w-3.5 h-3.5" />
                Install
              </button>
              <button
                onClick={dismiss}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
