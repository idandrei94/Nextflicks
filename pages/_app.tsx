import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import React, { useEffect, useState } from 'react';
import NavComponent from '@/components/nav/navComponent';
import { createMagic } from 'lib/magicAuth';
import { useRouter } from 'next/router';
import LoadingComponent from '@/components/loading/loadingComponent';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      setisLoading(false);
    });
    setisLoading(true);
    const checkLogin = async () => {
      const isLoggedIn = await createMagic().user.isLoggedIn();
      if (isLoggedIn) {
        router.push('/');
      } else {
        router.push('/login');
      }
    };
    checkLogin();
  }, []);

  return isLoading ? (
    <LoadingComponent />
  ) : (
    <React.Fragment>
      <NavComponent />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </React.Fragment>
  );
};
export default MyApp;
