import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={`${import.meta.env.BASE_URL}ncc-logo.svg`}
                alt="NCC Logo"
                className="h-14 w-auto object-contain flex-shrink-0"
              />
              <div>
                <p className="font-heading text-sm tracking-[0.3em] text-gold-400 uppercase">NCC TCET</p>
                <p className="font-body text-xs text-gray-400">National Cadet Corps</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-body">
              Thakur College of Engineering &amp; Technology NCC Unit — Training tomorrow's leaders with discipline, unity, and service.
            </p>
            <p className="mt-4 text-gold-500 font-heading text-xs tracking-[0.2em] uppercase">
              एकता और अनुशासन
            </p>
            <p className="text-gray-500 text-xs font-body italic mt-1">
              Unity &amp; Discipline
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-gray-100 uppercase tracking-widest text-sm mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-gold-500 inline-block" />
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About NCC' },
                { to: '/events', label: 'Event Registration' },
                { to: '/join', label: 'Join NCC' },
                { to: '/training', label: 'Training & Camps' },
                { to: '/achievements', label: 'Achievements' },
                { to: '/rules', label: 'Rules & Regulations' },
                { to: '/declaration', label: 'Declaration Form' },
                { to: '/login', label: 'Cadet Login' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-gold-400 font-body text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="h-px w-3 bg-gray-600 group-hover:bg-gold-500 transition-colors duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-gray-100 uppercase tracking-widest text-sm mb-5 flex items-center gap-2">
              <span className="h-px w-4 bg-gold-500 inline-block" />
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm font-body">
                <MapPin className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
                <span>TCET, Khopat, Thakur Village, Kandivali (E), Mumbai - 400101</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-body">
                <Mail className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>ncc@tcetmumbai.in</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm font-body">
                <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                <span>+91 22 2885 0088</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 bg-gray-800 border border-gray-700 hover:border-gold-500 flex items-center justify-center text-gray-400 hover:text-gold-400 transition-all duration-200 rounded-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-8 h-8 bg-gray-800 border border-gray-700 hover:border-gold-500 flex items-center justify-center text-gray-400 hover:text-gold-400 transition-all duration-200 rounded-sm"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="divider-gold mt-10 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs font-body">
            &copy; {new Date().getFullYear()} NCC TCET. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs font-body">
            Built for <span className="text-gold-600">courage</span>, discipline &amp; nation.
          </p>
        </div>
      </div>
    </footer>
  )
}
