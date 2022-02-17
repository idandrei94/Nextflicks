import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import React from 'react';
import NavComponent from '@/components/nav/navComponent';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <React.Fragment>
      <NavComponent />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </React.Fragment>
  );
};
export default MyApp;
