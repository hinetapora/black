// app/dashboard/layout.tsx
'use client';

import React from 'react';
import { Layout } from '@/components/dashboard/layout/layout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default DashboardLayout;