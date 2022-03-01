import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from '@/styles/Video.module.css';
import classnames from 'classnames';
import { Video } from '@/models/video';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next';
import { getVideosByKeyword } from 'lib/videosApi';
import LoadingComponent from '@/components/loading/loadingComponent';
import { getVideoFromApiById } from 'lib/client/getVideoFromApi';

Modal.setAppElement('#__next');

interface Props {
  video: Video | null;
}

const VideoPage: React.FC<Props> = ({ video }) => {
  const router = useRouter();
  const { id } = router.query;

  const [loadedVideo, setLoadedVideo] = useState(video);

  useEffect(() => {
    if (!loadedVideo) {
      const videoId = Array.isArray(id) ? id[0] : id;
      getVideoFromApiById(videoId!).then((v) => {
        setLoadedVideo(v);
      });
    }
  }, [loadedVideo]);

  return loadedVideo ? (
    <div className={styles.container}>
      <Modal
        isOpen={true}
        contentLabel="Watch dis shit"
        onRequestClose={() => {
          router.back();
        }}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <iframe
          id="ytplayer"
          width="100%"
          height="600px"
          src={`https://www.youtube.com/embed/${id}`}
          frameBorder="0"
          className={classnames(
            styles.iframe,
            styles.videoPlayer,
            styles.borderBoxShadow
          )}
        />

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>
                {new Date(loadedVideo.snippet.publishTime).toLocaleString()}
              </p>
              <p className={styles.title}>{loadedVideo.snippet.title}</p>
              <p className={styles.description}>
                {loadedVideo.snippet.description}
              </p>
            </div>
            <div className={styles.col2}>
              <p className={classnames(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Channel Name: </span>
                <span>{loadedVideo.snippet.channelTitle}</span>
              </p>
              <p className={classnames(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span>3141592</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  ) : (
    <LoadingComponent />
  );
};

export default VideoPage;

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const paths = getVideosByKeyword('').map((v) => ({
    params: { id: v.id.videoId.toString() }
  }));
  return {
    fallback: 'blocking',
    paths: paths
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params!.id;
  return {
    props: {
      video: getVideosByKeyword('').find((v) => v.id.videoId === id) || null
    }
  };
};
