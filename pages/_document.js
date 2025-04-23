import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Prepare for your Google Cloud Certification Exams with Cloud Certify - featuring interactive tests, quizzes, and detailed performance tracking." />
        <meta property="og:title" content="Cloud Certify - GCP Certification Preparation" />
        <meta property="og:description" content="Master GCP with Cloud Certify. Prepare for your Google Cloud certification exams with interactive tests and performance tracking." />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}