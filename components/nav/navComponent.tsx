import { createMagic } from 'lib/magicAuth';
import { route } from 'next/dist/server/router';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import styles from './navbar.module.css';

const NavComponent = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    magic.user.logout().then(() => {});
  };

  const checkLoginStatus = () => {
    setIsLoading(true);
    setUsername(null);
    const magic = createMagic();
    const meta = magic ? magic.user.getMetadata() : undefined;
    if (meta) {
      meta
        .then(({ email }) => {
          if (email) {
            setUsername(email);
          } else {
            router.push('/login');
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      checkLoginStatus();
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <a className={styles.logoLink} href="/">
          <div className={styles.logoWrapper}>
            <Image
              src={'/static/netflix.svg'}
              alt="Nextflicks logo"
              width="111px"
              height="30ox"
            />
          </div>
        </a>
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
              {username || isLoading ? (
                <div>
                  <button
                    className={styles.usernameBtn}
                    onClick={() => username && setShowDropdown(!showDropdown)}
                  >
                    <p className={styles.username}>
                      {username || 'Loading...'}
                    </p>
                    {!isLoading && (
                      <Image
                        src={'/static/expand_more.svg'}
                        alt="Expand dropdown"
                        height="24px"
                        width="24px"
                      />
                    )}
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
