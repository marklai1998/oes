// import App from 'next/app'

import { RecoilRoot } from "recoil";
import { UserAuthProvider } from "../hooks/useAuth";
import "antd/dist/antd.css";
import { Layout } from "../containers/_Layout";
import { createGlobalStyle } from "styled-components";
import Head from "next/head";
import { UserSocketProvider } from "../hooks/useSocket";
import { UseLayoutProvider } from "../hooks/useLayout";
import { UseTimeProvider } from "../hooks/useTime";
import { UseCameraProvider } from "../hooks/useCamera";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/static/favicon.ico" />
        <title>Onscreen Exam System</title>
      </Head>
      <GlobalStyle />
      <RecoilRoot>
        <UserAuthProvider>
          <UserSocketProvider>
            <UseTimeProvider>
              <UseLayoutProvider>
                <UseCameraProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </UseCameraProvider>
              </UseLayoutProvider>
            </UseTimeProvider>
          </UserSocketProvider>
        </UserAuthProvider>
      </RecoilRoot>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
body{
  background-color:#f9f9f9;
}
`;

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
