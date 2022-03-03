import { JwtPayloadModel } from '@/models/loginModel';
import { Video } from '@/models/video';
import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { hasuraGetUserVideos } from 'lib/db/hasura';
import { getVideosByKeyword } from 'lib/videosApi';
import useRedirectUser from 'lib/client/hooks/redirectUser';
import SectionCards from '@/components/card/sectionCardsComponent';
import styles from '@/styles/MyList.module.css';
import { getMyVideos } from 'lib/client/clientHasuraApi';

interface Props {
  videos: Video[];
}

const MyVideos: NextPage<Props> = ({ videos }) => {
  const [myVideos, setMyVideos] = useState<Video[]>(videos || []);

  useEffect(() => {
    if (videos.length === 0) getMyVideos().then(setMyVideos);
  }, [setMyVideos]);

  return (
    <div className={styles.main}>
      {myVideos.length ? (
        <SectionCards
          title="Watch again"
          size="small"
          videos={myVideos}
          shouldWrap={true}
        />
      ) : (
        <h1>No Videos watched yet</h1>
      )}
    </div>
  );
};

export default MyVideos;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { redirect, payload } = useRedirectUser(context);
  if (redirect) {
    return redirect;
  } else {
    const myVideosIds = await hasuraGetUserVideos(payload!.issuer);
    var videos = getVideosByKeyword('').filter((v) =>
      myVideosIds.find((s) => s.videoId === v.id.videoId)
    );
    return {
      props: {
        videos: videos
      }
    };
  }
};
