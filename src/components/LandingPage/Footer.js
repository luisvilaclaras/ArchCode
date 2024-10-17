import React from 'react';
import Link from 'next/link'; // Importar Link de Next.js

export default function Footer() {
  return (
    <footer className="bg-[#001F54] py-12 px-6 text-white">
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4">
        
        {/* Logo and tagline section */}
        <div className="mb-4 md:-ml-48 text-center">
            <Link href="/">
                <img src="/images/ArchCode.png" alt="ArchCode Logo" className="h-12 w-auto mx-auto cursor-pointer" />
            </Link>
            <p className="text-sm mt-1 text-gray-300 max-w-[200px] mx-auto text-center leading-tight">
                Acelera tus proyectos con la potencia de la IA y ahorra tiempo
            </p>
        </div>

        
        {/* Navigation links */}
        <div className="md:col-span-1 text-sm space-y-2">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <ul className="text-gray-300 space-y-2">
            <li><Link href="#" className="hover:text-white transition">Features</Link></li>
            <li><Link href="#" className="hover:text-white transition">Testimonials</Link></li>
            <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
            <li><Link href="#" className="hover:text-white transition">Start Guide</Link></li>
            <li><Link href="#" className="hover:text-white transition">Compatibility</Link></li>
            <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
            <li><Link href="#" className="hover:text-white transition">FAQ</Link></li>
          </ul>
        </div>

        {/* Support links */}
        <div className="md:col-span-1 text-sm space-y-2">
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="text-gray-300 space-y-2">
            <li><Link href="#" className="hover:text-white transition">Help Center</Link></li>
          </ul>
        </div>

        {/* Legal links */}
        <div className="md:col-span-1 text-sm space-y-2">
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="text-gray-300 space-y-2">
            <li><Link href="/terminos" className="hover:text-white transition">Terms & Conditions</Link></li>
            <li><Link href="/privacidad" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/politicas-usuario" className="hover:text-white transition">Acceptable Use</Link></li>
          </ul>
        </div>
      </div>

      {/* Social media and final touch */}
      <div className="mt-8 flex items-center justify-between text-gray-400 border-t border-gray-700 pt-6">
        <div className="text-sm">&copy; 2024 ArchCode. All rights reserved.</div>
        <div className="flex space-x-4">
          <Link href="#"><img src="/images/instagram.svg" alt="Instagram" className="h-6 w-6 hover:text-white transition" /></Link>
          <Link href="#"><img src="/images/tiktok.svg" alt="TikTok" className="h-6 w-6 hover:text-white transition" /></Link>
          <Link href="#"><img src="/images/twitter.svg" alt="X" className="h-6 w-6 hover:text-white transition" /></Link>
        </div>
      </div>
    </footer>
  );
}
