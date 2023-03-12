import { LanguageProvider } from "../lib/LanguageContext";
import "../styles/globals.css";
import { Tourney, Noto_Sans } from '@next/font/google'

const titleFont = Tourney({
  weight: ["700"],
  subsets: ['latin'],
  display: "auto",
  variable: '--title-font',
});

const textFont = Noto_Sans({
  weight: ["200","400","800"],
  subsets: ['latin'],
  display: "auto",
  variable: '--text-font',
});


function MyApp({ Component, pageProps }) {
  return<>
  <style jsx global>{`
        html {
          font-family: ${textFont.style.fontFamily};
        }
        h1,h2,h3,h4, .h2{
          font-family: ${titleFont.style.fontFamily};
        }
      `}</style>
  
     <main>
    <LanguageProvider>
      <Component {...pageProps}/>
    </LanguageProvider>
  </main></>
  ;
}

export default MyApp;
