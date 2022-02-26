import { Video } from '@/models/video';
import React from 'react';
import Card from './cardComponent';
import styles from './section-cards.module.css';

interface Props {
  title: string;
  size?: 'large' | 'medium' | 'small';
  videos: Video[];
}

const SectionCards: React.FC<Props> = ({ title, videos, size }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video) => (
          <Card size={size} video={video} key={video.id.videoId} />
        ))}
      </div>
    </div>
  );
};

export default SectionCards;
