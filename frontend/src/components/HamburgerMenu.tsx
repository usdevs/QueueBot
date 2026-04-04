import { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';

interface HamburgerMenuProps {
  onSettingsClick: () => void;
}

export function HamburgerMenu({ onSettingsClick }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Menu size={24} className="text-white" />
        )}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <nav
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 transform transition-transform z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20 space-y-4">
          <button
            onClick={() => {
              onSettingsClick();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition"
          >
            <Settings size={20} />
            <span>Event Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
}
