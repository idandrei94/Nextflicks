import React from 'react';
import styles from './loading.module.css';

const LoadingComponent = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loader}>Loading...</div>
    </div>
  );
};

export default LoadingComponent;
