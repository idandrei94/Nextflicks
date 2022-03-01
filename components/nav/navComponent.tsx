import { createMagic } from 'lib/client/magicAuth';
import Image from 'next/image';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import styles from './navbar.module.css';

const NavComponent = () => {
  const [username, setUsername] = useState<string | null>(null);

  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  const handleOnClickHome = (e: any) => {
    e.preventDefault();
    router.push('/');
  };
  const handleOnClickMyList = (e: any) => {
    e.preventDefault();
    router.push('/browse/my-list');
  };
  const handleSignout = () => {
    const magic = createMagic();
    magic.user.logout().then(() => {
      setUsername(null);
      localStorage.clear();
      router.push('/login');
    });
  };

  useEffect(() => {
    const email = localStorage.getItem('name');
    const validUntil = localStorage.getItem('validUntil');
    console.log('home page ', email, validUntil);
    if (
      email &&
      validUntil &&
      Date.now() / 1000 < Number.parseInt(validUntil)
    ) {
      setUsername(email);
    } else {
      localStorage.clear();
      router.push('/login');
    }
  }, [router.route, username]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/">
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src={'/static/netflix.svg'}
                alt="Nextflicks logo"
                width="111px"
                height="30ox"
              />
            </div>
          </a>
        </Link>
        {router.route !== '/login' && (
          <React.Fragment>
            <ul className={styles.navItems}>
              <li className={styles.navItem} onClick={handleOnClickHome}>
                Home
              </li>
              <li className={styles.navItem2} onClick={handleOnClickMyList}>
                MyList
              </li>
            </ul>

            <nav className={styles.navContainer}>
              {username ? (
                <div>
                  <button
                    className={styles.usernameBtn}
                    onClick={() => username && setShowDropdown(!showDropdown)}
                  >
                    <p className={styles.username}>
                      {username || 'Loading...'}
                    </p>
                    <Image
                      src={'/static/expand_more.svg'}
                      alt="Expand dropdown"
                      height="24px"
                      width="24px"
                    />
                  </button>
                  {showDropdown && (
                    <div className={styles.navDropdown}>
                      <div>
                        <Link href="/login">
                          <a
                            className={styles.linkName}
                            onClick={handleSignout}
                          >
                            Sign out
                          </a>
                        </Link>
                        <div className={styles.lineWrapper} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <a>Sign In</a>
                </Link>
              )}
            </nav>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default NavComponent;
