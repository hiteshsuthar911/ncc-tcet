import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Youtube, Shield, ChevronRight } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-navy-950 text-gray-300">
      {/* NCC Motto Banner */}
      <div className="bg-navy-900 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-saffron-400" />
            <span className="font-heading font-bold text-xl text-white tracking-wider">एकता और अनुशासन</span>
          </div>
          <span className="hidden sm:block w-px h-5 bg-navy-700" />
          <span className="font-body text-navy-300 text-sm tracking-[0.15em] uppercase">Unity &amp; Discipline</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={`${import.meta.env.BASE_URL}ncc-logo.svg`}
                alt="NCC Logo"
                className="h-12 w-auto object-contain flex-shrink-0"
              />
              <div>
                <p className="font-heading font-bold text-base text-white">NCC TCET</p>
                <p className="font-body text-xs text-navy-400">National Cadet Corps</p>
              </div>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed font-body mb-5">
              Thakur College of Engineering &amp; Technology NCC Unit — shaping tomorrow's leaders through discipline, service, and patriotism.
            </p>
            <div className="flex gap-2.5">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 bg-navy-800 hover:bg-saffron-500 border border-navy-700 hover:border-saffron-500 rounded-xl flex items-center justify-center text-navy-400 hover:text-white transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 bg-navy-800 hover:bg-red-600 border border-navy-700 hover:border-red-600 rounded-xl flex items-center justify-center text-navy-400 hover:text-white transition-all duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-5 pb-2 border-b border-navy-800">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About NCC' },
                { to: '/events', label: 'Event Registration' },
                { to: '/join', label: 'Join NCC' },
                { to: '/training', label: 'Training & Camps' },
                { to: '/forms', label: 'Forms' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-navy-400 hover:text-white font-body text-sm transition-colors duration-200 group"
                  >
                    <ChevronRight className="w-3 h-3 text-saffron-500 group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-5 pb-2 border-b border-navy-800">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/achievements', label: 'Achievements' },
                { to: '/team', label: 'Our Team' },
                { to: '/activities', label: 'Activities' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/magazine', label: 'Magazine' },
                { to: '/rules', label: 'Rules & Regulations' },
                { to: '/declaration', label: 'Declaration Form' },
                { to: '/login', label: 'Cadet Login' },
                { to: '/download', label: 'Download App' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-navy-400 hover:text-white font-body text-sm transition-colors duration-200 group"
                  >
                    <ChevronRight className="w-3 h-3 text-saffron-500 group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-5 pb-2 border-b border-navy-800">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm font-body">
                <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-saffron-400" />
                </div>
                <span className="text-navy-300 leading-relaxed">TCET, Khopat, Thakur Village, Kandivali (E), Mumbai – 400101</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-body">
                <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-saffron-400" />
                </div>
                <a href="mailto:ncc@tcetmumbai.in" className="text-navy-300 hover:text-white transition-colors">ncc@tcetmumbai.in</a>
              </li>
              <li className="flex items-center gap-3 text-sm font-body">
                <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-saffron-400" />
                </div>
                <span className="text-navy-300">+91 22 2885 0088</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-navy-500 text-xs font-body">
            &copy; {year} NCC TCET — Thakur College of Engineering &amp; Technology. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-navy-500 text-xs font-body">
              Built with <span className="text-saffron-400">pride</span> for the cadets of TCET
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
