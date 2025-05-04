import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preload critical fonts */}
          <link
            rel="preload"
            href="/_next/static/media/fonts/your-font.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          {/* Ensure font display behavior is appropriate */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Your Font';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url('/_next/static/media/fonts/your-font.woff2') format('woff2');
              }
              /* Force fonts to render at consistent sizes */
              html {
                font-size: 16px !important;
              }
              body {
                font-family: 'Your Font', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
              }
            `
          }} />
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
}

export default MyDocument;