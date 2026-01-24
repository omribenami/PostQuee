'use client';

import { FC, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  children: React.ReactNode;
}

export const MobileNav: FC<MobileNavProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-menu-btn mobile:flex hidden touch-active"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Overlay */}
      <div
        className={`mobile-drawer-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'active' : ''}`}>
        {children}
      </div>
    </>
  );
};
