import React from 'react';
import styles from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.root}>
      <div className={styles.dot_falling}></div>
    </div>
  );
};

export { Loader };