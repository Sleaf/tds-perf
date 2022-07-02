import Head from 'next/head';
import NextLink from 'next/link';
import JoyLink from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import styles from '../styles/Home.module.css';
import { withSessionSsr } from '../lib/session';

export default function Home({ user }) {
  if (!user) {
    return (
      <div>
        <Head>
          <meta httpEquiv="refresh" content="0; URL='/login'" />
        </Head>
        Redirecting you to the login page.
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>TDS Perf Review</h1>

        <p className={styles.description}>你好，{user.username}</p>

        <div className={styles.actions}>
          <Typography variant="plain" level="h3" startDecorator="🚀 ">
            <NextLink href="/self-reviews/2022-q2" passHref>
              <JoyLink>2022 Q2 Self Review</JoyLink>
            </NextLink>
          </Typography>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withSessionSsr(({ req }) => {
  return { props: { user: req.session.user } };
});
