import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from '@/styles/Video.module.css';
import classnames from 'classnames';
import { Video, VideoStats } from '@/models/video';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getVideosByKeyword } from 'lib/videosApi';
import LoadingComponent from '@/components/loading/loadingComponent';
import { getVideoFromApiById } from 'lib/client/getVideoFromApi';
import LikeIcon from '@/components/icons/like-icon';
import DislikeIcon from '@/components/icons/dislike-icon';
import Head from 'next/head';
import {
  changeVideoFavorite,
  getVideoStatsById
} from 'lib/client/clientHasuraApi';

Modal.setAppElement('#__next');

interface Props {
  video: Video | null;
}

const statusToText = (status: number | undefined) => {
  switch (status) {
    case 1:
      return 'like';
    case -1:
      return 'dislike';
    default:
      return 'clear';
  }
};

const VideoPage: React.FC<Props> = ({ video }) => {
  const router = useRouter();
  const { id } = router.query;

  const [loadedVideo, setLoadedVideo] = useState(video);
  const [isLoading, setisLoading] = useState(false);
  const [videoStatsState, setvideoStatsState] = useState<
    VideoStats | undefined
  >(undefined);

  const handleLikeButton = async (like: number) => {
    setisLoading(true);
    if (like === videoStatsState?.favorite) {
      const status = await changeVideoFavorite('clear', id as string);
      console.log(status);
      setvideoStatsState(status);
    } else {
      const status = await changeVideoFavorite(
        statusToText(like),
        id as string
      );
      console.log(status);
      setvideoStatsState(status);
    }
    setisLoading(false);
  };

  useEffect(() => {
    if (!loadedVideo) {
      const videoId = Array.isArray(id) ? id[0] : id;
      getVideoFromApiById(videoId!).then((v) => {
        setLoadedVideo(v);
      });
    }
    const getVideoStats = async () => {
      setisLoading(true);
      const stats = await getVideoStatsById(id as string);
      setvideoStatsState(stats);
      setisLoading(false);
    };
    getVideoStats();
  }, [loadedVideo]);

  return loadedVideo ? (
    <div className={styles.container}>
      <Head>
        <title>Nextflicks | {loadedVideo.snippet.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
        {!isLoading && (
          <div className={styles.likeDislikeBtnWrapper}>
            <div className={styles.likeBtnWrapper}>
              <button onClick={() => handleLikeButton(1)}>
                <div className={styles.btnWrapper}>
                  <LikeIcon
                    selected={videoStatsState && videoStatsState.favorite === 1}
                  />
                </div>
              </button>
            </div>
            <button onClick={() => handleLikeButton(-1)}>
              <div className={styles.btnWrapper}>
                <DislikeIcon
                  selected={videoStatsState && videoStatsState.favorite === -1}
                />
              </div>
            </button>
          </div>
        )}
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
              {!!videoStatsState && (
                <p
                  className={classnames(styles.subText, styles.subTextWrapper)}
                >
                  <span className={styles.textColor}>View Count: </span>
                  <span>{videoStatsState.viewsTotal}</span>
                </p>
              )}
              {!!videoStatsState && (
                <p
                  className={classnames(styles.subText, styles.subTextWrapper)}
                >
                  <span className={styles.textColor}>
                    {videoStatsState.likeTotal >= 0 ? 'Likes: ' : 'Dislikes: '}
                  </span>
                  <span>{Math.abs(videoStatsState.likeTotal)}</span>
                </p>
              )}
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
    fallback: false,
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
