import Head from 'next/head';
import React from 'react';
import styles from '@/styles/Home.module.css';
import CardComponent from '@/components/card/cardComponent';
import BannerComponent from '@/components/banner/bannerComponent';

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflicks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Nextflicks</h1>
      <BannerComponent
        title="Clifford the red dog"
        subtitle="Seriously, wtf is dis shit"
        imageUrl="/static/clifford.webp"
      />
      <CardComponent />
      <CardComponent />
      <CardComponent />
      <CardComponent />
    </div>
  );
};

export default Home;
