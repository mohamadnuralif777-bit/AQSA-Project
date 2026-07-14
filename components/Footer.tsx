import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4">About Quran Reader</h4>
            <p className="text-green-100 text-sm">
              An interactive platform for reading, studying, and understanding the Holy Quran.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#reader" className="hover:text-white transition">
                  Reader
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-green-100">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Tafsir
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Translations
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-300 transition">Facebook</a>
              <a href="#" className="hover:text-yellow-300 transition">Twitter</a>
              <a href="#" className="hover:text-yellow-300 transition">Instagram</a>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-100 text-sm">
              &copy; 2024 Quran Reader. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-green-100">
              <Link href="#" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
