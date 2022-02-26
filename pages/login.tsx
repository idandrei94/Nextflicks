import Head from 'next/head';
import React, { FormEventHandler, useState } from 'react';
import styles from '@/styles/Login.module.css';
import { useRouter } from 'next/router';
import { createMagic } from 'lib/magicAuth';

const LoginPage = () => {
  const [userMsg, setUserMsg] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | undefined>('id.andrei@yahoo.com');

  const router = useRouter();

  const handleSubmit = async () => {
    const magic = createMagic();
    if (email && magic) {
      try {
        setIsLoading(true);
        const didToken = await magic.auth.loginWithMagicLink({
          email: email
        });
        localStorage.setItem('didToken', didToken!);
        router.push('/');
      } catch (error) {
        console.log(error);
        setUserMsg('An unknown error occured. Please try again later.');
        setIsLoading(false);
      }
    }
  };
  const onEmailChanged: FormEventHandler<HTMLInputElement> = (e) => {
    const email = e.currentTarget.value;
    if (!email || !e.currentTarget.validity.valid) {
      setUserMsg('Please enter a correct email address.');
      setEmail(undefined);
    } else {
      setUserMsg(undefined);
      setEmail(email);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Nextflicks Sign In</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.mainWrapper}>
            <h1 className={styles.signinHeader}>Sign In</h1>
            <input
              type="email"
              placeholder="Email Address"
              className={styles.emailInput}
              onChange={onEmailChanged}
              value="id.andrei@yahoo.com"
            />
            <p className={styles.userMsg}>{userMsg}</p>
            <button
              onClick={handleSubmit}
              className={styles.loginBtn}
              disabled={!!userMsg || !email || isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginPage;
