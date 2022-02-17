import Image from 'next/image';
import React from 'react';
import styles from './Banner.module.css';

interface Props {
  title: string;
  subtitle: string;
  imageUrl: string;
}

const BannerComponent: React.FC<Props> = ({ title, subtitle, imageUrl }) => {
  const handleOnPlay = () => {};

  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <h3 className={styles.subTitle}>{subtitle}</h3>

          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handleOnPlay}>
              <Image
                src="/static/play_arrow.svg"
                alt="Play icon"
                width="32px"
                height="32px"
              />
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imageUrl}`
        }}
      ></div>
    </div>
  );
};

export default BannerComponent;