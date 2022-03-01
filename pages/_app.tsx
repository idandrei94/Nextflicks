import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import NavComponent from '@/components/nav/navComponent';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LoadingComponent from '@/components/loading/loadingComponent';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

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
