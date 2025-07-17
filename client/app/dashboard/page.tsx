'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!supabase) {
        console.error('Supabase not initialised');
        router.push('/');
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile', error);
      }

      if (profile) {
        router.push('/user');
      } else {
        router.push('/pfpcreate');
      }
    };

    checkProfile().finally(() => setChecking(false));
  }, [router]);

  return (
    <div className="w-full h-screen flex items-center justify-center text-white bg-black">
      {checking ? 'Redirecting...' : 'Redirect'}
    </div>
  );
} 