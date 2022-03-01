import Image from 'next/image';
import React, { useState } from 'react';
import styles from './card.module.css';
import { motion } from 'framer-motion';
import classnames from 'classnames';
import { Video } from '@/models/video';
import Link from 'next/link';

interface Props {
  video: Video;
  size?: 'large' | 'medium' | 'small';
}

const classMap = {
  large: styles.lgItem,
  medium: styles.mdItem,
  small: styles.smItem
};

const getVideoThumbnail = (
  size: 'large' | 'medium' | 'small',
  video: Video
) => {
  switch (size) {
    case 'large':
      return video.snippet.thumbnails.high;
    case 'medium':
      return video.snippet.thumbnails.medium;
    default:
      return video.snippet.thumbnails.medium;
  }
};

const imageUrlFallback =
  'https://images.unsplash.com/photo-1633078654544-61b3455b9161?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1045&q=80';

const Card: React.FC<Props> = ({ video, size = 'medium' }) => {
  const [imageUrlState, setImageUrlState] = useState(
    getVideoThumbnail(size, video).url
  );
  return (
    <div className={styles.container}>
      <Link href={`/video/${video.id.videoId}`} passHref>
        <motion.div
          className={classnames(classMap[size], styles.imgMotionWrapper)}
          whileHover={{ scale: 1.1 }}
        >
          <Image
            priority
            src={imageUrlState}
            alt="card image"
            layout="fill"
            className={styles.cardImg}
            onError={() => setImageUrlState(imageUrlFallback)}
          />
        </motion.div>
      </Link>
    </div>
  );
};

export default Card;
