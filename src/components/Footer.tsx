'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

interface Office {
  name: string;
  title?: string;
  address: string;
  phone?: string;
  details?: string[];
}

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const offices: Office[] = [
    {
      name: 'REGISTERED OFFICE',
      title: 'Yuva Rural Association',
      address: 'M.I.G.-208, E-7, Arera colony, Dist Hujur, Bhopal-462016',
    },
    {
      name: 'HEAD OFFICE - NAGPUR',
      title: 'Yuva Rural Association',
      address: 'Plot No. 19, 2nd Floor, New Akash Nagar Near Sant Gajanan Hall, Manewada, Chikhali Road, Nagpur-440034',
      phone: '91 – 7083328154',
    },
    {
      name: 'BHANDARA',
      title: 'COUNSELLING CENTER',
      address: 'Beside Police Library, Police Headquarter, Bhandara-441904',
      phone: '9422831083',
    },
    {
      name: 'WASHIM',
      title: 'YRA-DHARA (Demonstrative Hub For Agriculture & Renewable Activities)',
      address: 'Village – Kurhad, Near Kamargoan, Karanja lad, Washim-444105',
      phone: '8087993739',
    },
    {
      name: 'HINGOLI',
      title: 'Water Security Project',
      address: 'Sant Namdev Nagar, Balsond, Hingoli-431513',
    },
    {
      name: 'GADCHIROLI - BHAMRAGAD',
      title: 'YRA-BRLF Office Bhamragad',
      address: 'C/o. Janabai Sontakke House Ward No.03 Nearby Bhagwantrao High School, Bhamragad-442710',
    },
    {
      name: 'LATUR',
      title: 'Yuva Rural Association',
      address: 'Vivekanand Chowk, Behind Kolpuke Hospital, Nath Nagar, Latur-413512',
    },
  ];

  const quickLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Refund', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Newsletter Section */}
        <div className="mb-12 pb-8 border-b border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
          {subscribed && <p className="text-green-400 text-sm mt-2">Thank you for subscribing!</p>}
        </div>

        {/* Quick Links */}
        <div className="mb-12 pb-8 border-b border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <div className="flex gap-6">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Offices Section */}
        <div className="mb-8">
          <h3 className="text-white text-lg font-semibold mb-8">Our Offices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="space-y-3">
                <h4 className="text-white font-semibold">{office.name}</h4>
                {office.title && <p className="text-sm text-gray-400">{office.title}</p>}
                
                <div className="flex gap-2 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{office.address}</p>
                </div>

                {office.phone && (
                  <div className="flex gap-2 text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>{office.phone}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Email Contact */}
        <div className="pt-8 border-t border-gray-700 flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4" />
          <p>
            Email:{' '}
            <a href="mailto:info@yraindia.org" className="text-blue-400 hover:text-blue-300">
              info@yraindia.org
            </a>
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Yuva Rural Association. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
