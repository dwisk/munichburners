import { LanguageProvider } from "../lib/LanguageContext";
import "../styles/globals.css";
import { Montserrat_Alternates } from '@next/font/google'

const burnerFont = Montserrat_Alternates({
  weight: ["400", "900"],
  subsets: ['latin'],
  display: "auto",
  variable: '--burner-font',
});


function MyApp({ Component, pageProps }) {
  return   <main  className={burnerFont.className}>
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  </main>;
}

export default MyApp;
