// components/dashboard/Header.tsx
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {Navbar} from '../navbar';       // Main site's navbar component
import {ProBanner} from '../pro-banner';            // Main site's pre-banner component

const Header = () => {
  const pathname = usePathname();

  // Determine if the current route is under '/dashboard'
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    // Do not render the main site's navbar and pre-banner on dashboard routes
    return null;
  }

  return (
    <>
      <ProBanner />
      <Navbar />
    </>
  );
};

export default Header;