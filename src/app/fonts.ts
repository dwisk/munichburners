import { Tourney, Noto_Sans } from 'next/font/google';

export const titleFont = Tourney({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-title',
})

export const textFont = Noto_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-text',
})
