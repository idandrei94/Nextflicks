import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';
import BannerComponent from '@/components/banner/bannerComponent';
import SectionCards from '@/components/card/sectionCardsComponent';
import { getVideosByKeyword } from 'lib/videosApi';
import { Video } from '@/models/video';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

interface Props {
  categories: {
    title: string;
    videos: Video[];
  }[];
}

const Home: React.FC<Props> = ({ categories }) => {
  const [categoriesState, setCategories] = useState(categories);
  const router = useRouter();

  useEffect(() => {
    if (!categoriesState || categoriesState.length == 0) {
      setCategories(
        ['Starcraft II', 'Kevin Powell', 'Dark Souls'].map((v) => ({
          title: v,
          videos: getVideosByKeyword(v)
        }))
      );
    }
  }, [categoriesState]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflicks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BannerComponent
        title="Clifford the red dog"
        subtitle="Seriously, wtf is dis shit"
        imageUrl="/static/clifford.webp"
      />
      <div className={styles.sectionWrapper}>
        {categories.map((c) => (
          <SectionCards
            title={c.title}
            size="small"
            videos={c.videos}
            key={c.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      categories: ['Starcraft 2', 'Kevin Powell', 'Dark Souls'].map((v) => ({
        title: v,
        videos: getVideosByKeyword(v).filter(
          (vid) =>
            vid.id.kind === 'youtube#video' &&
            (vid.snippet.title.toLowerCase().includes(v.toLowerCase()) ||
              vid.snippet.channelTitle
                .toLowerCase()
                .includes(v.toLowerCase()) ||
              vid.snippet.description
                .toLocaleLowerCase()
                .includes(v.toLowerCase()))
        )
      }))
    }
  };
};
