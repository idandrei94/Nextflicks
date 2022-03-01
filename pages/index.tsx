import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/Home.module.css';
import BannerComponent from '@/components/banner/bannerComponent';
import SectionCards from '@/components/card/sectionCardsComponent';
import { getVideosByKeyword } from 'lib/videosApi';
import { Video } from '@/models/video';
import { GetServerSideProps } from 'next';

interface Props {
  categories: {
    title: string;
    videos: Video[];
  }[];
  featuredVideo: Video;
}

const Home: React.FC<Props> = ({ categories, featuredVideo: propFeature }) => {
  const [categoriesState, setCategories] = useState(categories);
  const [featuredVideo, setFeaturedVideo] = useState(propFeature);

  useEffect(() => {
    if (!categoriesState || categoriesState.length == 0) {
      const videos = getVideosByKeyword('');
      setCategories(
        ['Starcraft II', 'Kevin Powell', 'Dark Souls'].map((v) => ({
          title: v,
          videos: videos.filter(
            (vid) =>
              vid.snippet.title.toLowerCase().includes(v.toLowerCase()) ||
              vid.snippet.channelTitle
                .toLowerCase()
                .includes(v.toLowerCase()) ||
              vid.snippet.description
                .toLocaleLowerCase()
                .includes(v.toLowerCase())
          )
        }))
      );
      setFeaturedVideo(videos[Math.floor(Math.random() * videos.length)]);
    }
  }, [categoriesState]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflicks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BannerComponent
        videoId={featuredVideo.id.videoId}
        title={featuredVideo.snippet.title}
        subtitle={featuredVideo.snippet.description}
        imageUrl={featuredVideo.snippet.thumbnails.high.url}
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

export const getStaticProps: GetServerSideProps = async (ctx) => {
  const videos = getVideosByKeyword('');
  return {
    props: {
      categories: ['Starcraft 2', 'Kevin Powell', 'Dark Souls'].map((v) => ({
        title: v,
        videos: videos.filter(
          (vid) =>
            vid.snippet.title.toLowerCase().includes(v.toLowerCase()) ||
            vid.snippet.channelTitle.toLowerCase().includes(v.toLowerCase()) ||
            vid.snippet.description
              .toLocaleLowerCase()
              .includes(v.toLowerCase())
        )
      })),
      featuredVideo: videos[Math.floor(Math.random() * videos.length)]
    },
    revalidate: 60
  };
};
