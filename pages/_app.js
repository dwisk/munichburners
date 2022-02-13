import { LanguageProvider } from "../lib/LanguageContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return <LanguageProvider>
    <Component {...pageProps} />
  </LanguageProvider>;
}

export default MyApp;
