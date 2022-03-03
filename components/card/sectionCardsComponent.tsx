import { Video } from '@/models/video';
import React from 'react';
import Card from './cardComponent';
import styles from './section-cards.module.css';
import classnames from 'classnames';

interface Props {
  title: string;
  size?: 'large' | 'medium' | 'small';
  videos: Video[];
  shouldWrap?: boolean;
}

const SectionCards: React.FC<Props> = ({
  title,
  videos,
  size,
  shouldWrap = false
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div
        className={classnames(styles.cardWrapper, shouldWrap && styles.wrap)}
      >
        {videos.map((video) => (
          <Card size={size} video={video} key={video.id.videoId} />
        ))}
      </div>
    </div>
  );
};

export default SectionCards;
