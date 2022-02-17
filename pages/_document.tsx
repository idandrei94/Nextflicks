import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

const Document = () => {
  return (
    <Html>
      <Head>
        <link ref="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
