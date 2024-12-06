'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Content } from '@/components/account/home/content';
import { supabase } from '@/utils/supabaseClient'; // Adjust the path if needed

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session?.user?.id) {
          router.push('/auth'); // Redirect to the authentication page
          return;
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return <Content />;
};

export default DashboardPage;