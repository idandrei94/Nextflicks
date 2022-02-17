import React from 'react';
import styles from './navbar.module.css';

const NavComponent = () => {
  return (
    <nav className={styles.nav}>
      <div>Logo</div>
      <ul>
        <li>MyList</li>
      </ul>
      <div>User</div>
    </nav>
  );
};

export default NavComponent;
