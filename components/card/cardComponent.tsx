import React from 'react';
import styles from './card.module.css';

const CardComponent = () => {
  return (
    <div className={styles.container}>
      <h3 className="text-left">Disney</h3>
      <div className={styles.list}>
        <span>something</span>
        <span>something</span>
        <span>something</span>
      </div>
    </div>
  );
};

export default CardComponent;
