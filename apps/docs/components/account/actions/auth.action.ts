// actions/auth.action.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const deleteAuthCookie = () => {
  const cookieStore = cookies();
  cookieStore.delete('next-auth.session-token'); // Replace with your auth cookie name
  cookieStore.delete('next-auth.csrf-token');    // If applicable

  // Optionally, redirect the user after logout
  redirect('/login');
};