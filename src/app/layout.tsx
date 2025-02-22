import '../styles/globals.css'
import { textFont, titleFont } from './fonts';
interface props {
    children: React.ReactNode;
}
 
export default async function Layout({ children }:props) {
    return (
        <html lang="en" className={`${textFont.variable} ${titleFont.variable}`}>
            <body>
                {children}
            </body>
        </html>
    );
};