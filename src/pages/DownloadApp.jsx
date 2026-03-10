import { useState, useEffect } from 'react'
import {
  Download, Smartphone, Monitor, Apple, Chrome,
  CheckCircle, Shield, Wifi, Bell, Zap, Share2, PlusSquare, MoreVertical,
} from 'lucide-react'

const FEATURES = [
  { icon: Wifi,        label: 'Works Offline',       desc: 'Access your profile, events & schedule even without internet.' },
  { icon: Bell,        label: 'Push Notifications',  desc: 'Get instant alerts for events, attendance & announcements.' },
  { icon: Zap,         label: 'Instant Load',         desc: 'Loads in milliseconds — faster than opening a browser.' },
  { icon: Shield,      label: 'Secure & Private',    desc: 'All data encrypted. No third-party app store required.' },
]

const STEPS_ANDROID = [
  { icon: Chrome,       step: '1', text: 'Open the site in Chrome on your Android device.' },
  { icon: MoreVertical, step: '2', text: 'Tap the three-dot menu (⋮) in the top-right corner.' },
  { icon: Download,     step: '3', text: 'Tap "Add to Home screen" or "Install app".' },
  { icon: CheckCircle,  step: '4', text: 'Tap "Add" in the confirmation dialog. Done!' },
]

const STEPS_IOS = [
  { icon: Share2,     step: '1', text: 'Open the site in Safari on your iPhone or iPad.' },
  { icon: PlusSquare, step: '2', text: 'Tap the Share button (□↑) at the bottom of the screen.' },
  { icon: PlusSquare, step: '3', text: 'Scroll down and tap "Add to Home Screen".' },
  { icon: CheckCircle, step: '4', text: 'Tap "Add" in the top-right corner. Done!' },
]

const STEPS_DESKTOP = [
  { icon: Chrome,      step: '1', text: 'Open the site in Chrome or Edge on your computer.' },
  { icon: Download,    step: '2', text: 'Click the install icon (⊕) in the address bar on the right.' },
  { icon: CheckCircle, step: '3', text: 'Click "Install" in the popup. The app opens as a window!' },
]

export default function DownloadApp() {
  const [platform, setPlatform]         = useState('android') // android | ios | desktop
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled]       = useState(false)
  const [installing, setInstalling]     = useState(false)

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent || ''
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      setPlatform('ios')
    } else if (/Android/.test(ua)) {
      setPlatform('android')
    } else {
      setPlatform('desktop')
    }

    // Already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    setInstalling(true)
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setDeferredPrompt(null)
    setInstalling(false)
  }

  const steps = platform === 'ios' ? STEPS_IOS : platform === 'desktop' ? STEPS_DESKTOP : STEPS_ANDROID

  return (
    <div className="min-h-screen bg-military-darker">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-military-darker via-army-950 to-military-dark border-b border-army-800">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #4a7c59 0, #4a7c59 1px, transparent 0, transparent 50%)', backgroundSize: '14px 14px' }} />

        <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
          {/* App icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-army-800 border-2 border-gold-600/60 flex items-center justify-center shadow-2xl shadow-black/40">
            <img
              src={`${import.meta.env.BASE_URL}ncc-logo.svg`}
              alt="NCC TCET"
              className="w-16 h-16 object-contain"
              onError={e => { e.target.style.display = 'none' }}
            />
            <Shield className="w-14 h-14 text-gold-400 absolute" style={{ display: 'none' }} />
          </div>

          <p className="font-heading text-gold-500 text-xs uppercase tracking-[0.4em] mb-2">NCC TCET</p>
          <h1 className="font-heading text-4xl sm:text-5xl text-white uppercase tracking-widest leading-tight mb-4">
            Download<br className="sm:hidden" /> the App
          </h1>
          <p className="font-body text-army-300 text-base max-w-xl mx-auto leading-relaxed mb-8">
            Install the NCC TCET cadet portal on your device for fast, offline-ready access —
            no App Store required.
          </p>

          {/* Install CTA */}
          {installed ? (
            <div className="inline-flex items-center gap-3 bg-green-900/40 border border-green-700/50 px-6 py-3 text-green-300 font-heading text-sm uppercase tracking-widest">
              <CheckCircle className="w-5 h-5 text-green-400" />
              App is already installed!
            </div>
          ) : deferredPrompt ? (
            <button
              onClick={handleInstall}
              disabled={installing}
              className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-base"
            >
              <Download className="w-5 h-5" />
              {installing ? 'Installing…' : 'Install Now — It\'s Free'}
            </button>
          ) : (
            <div className="inline-flex items-center gap-3 bg-army-800/60 border border-army-700 px-6 py-3 text-army-300 font-body text-sm">
              <Smartphone className="w-4 h-4 text-gold-400" />
              Follow the steps below to install on your device
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Features */}
        <div>
          <p className="font-heading text-xs text-gold-500 uppercase tracking-[0.3em] text-center mb-2">Why install?</p>
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest text-center mb-10">App Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="card-army p-6 flex gap-4 items-start">
                <div className="w-10 h-10 bg-army-800 border border-army-700 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="font-heading text-white text-sm uppercase tracking-wider mb-1">{label}</p>
                  <p className="font-body text-army-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to install */}
        <div>
          <p className="font-heading text-xs text-gold-500 uppercase tracking-[0.3em] text-center mb-2">Installation guide</p>
          <h2 className="font-heading text-2xl text-white uppercase tracking-widest text-center mb-6">How to Install</h2>

          {/* Platform tabs */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {[
              { id: 'android', label: 'Android',  icon: Smartphone },
              { id: 'ios',     label: 'iPhone / iPad', icon: Apple },
              { id: 'desktop', label: 'Desktop',  icon: Monitor },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPlatform(id)}
                className={`flex items-center gap-2 px-5 py-2.5 font-heading text-xs uppercase tracking-widest border transition-all duration-200 ${
                  platform === id
                    ? 'bg-army-700 border-army-500 text-white'
                    : 'bg-transparent border-army-800 text-army-400 hover:border-army-600 hover:text-army-200'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-4 max-w-lg mx-auto">
            {steps.map(({ icon: Icon, step, text }) => (
              <div key={step} className="flex items-start gap-5">
                <div className="w-10 h-10 bg-army-800 border border-gold-700/50 flex items-center justify-center flex-shrink-0">
                  <span className="font-heading text-gold-400 text-sm">{step}</span>
                </div>
                <div className="flex-1 pt-2">
                  <p className="font-body text-army-200 text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* iOS note */}
          {platform === 'ios' && (
            <div className="mt-8 max-w-lg mx-auto bg-army-900/60 border border-army-700 p-4">
              <p className="font-body text-army-400 text-xs leading-relaxed">
                <span className="text-gold-400 font-heading uppercase tracking-wider text-[11px]">Note: </span>
                iOS requires Safari — install does not work in Chrome or other browsers on iPhone/iPad.
                The Share button (□↑) is in the bottom toolbar.
              </p>
            </div>
          )}
        </div>

        {/* QR code / URL */}
        <div className="card-army p-8 text-center">
          <p className="font-heading text-xs text-gold-500 uppercase tracking-[0.3em] mb-2">Quick Access</p>
          <h3 className="font-heading text-xl text-white uppercase tracking-widest mb-4">Share the App</h3>
          <p className="font-body text-army-400 text-sm mb-6">Open this URL in any browser to access the NCC TCET portal:</p>
          <div className="inline-block bg-army-900 border border-army-700 px-6 py-3 font-mono text-gold-400 text-sm break-all">
            https://hiteshsuthar911.github.io/ncc-tcet/
          </div>
          <p className="font-body text-army-600 text-xs mt-4">
            Compatible with Chrome, Edge, Safari, Firefox on all platforms.
          </p>
        </div>

      </div>
    </div>
  )
}
