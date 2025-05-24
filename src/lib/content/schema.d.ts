import { DreamYear } from "../dreams/schema";
import { Image } from "../pages/schema";

export type ContentType = ContentMap 
                          | ContentText 
                          | ContentImage 
                          | ContentHeadline 
                          | ContentTeaser 
                          | ContentLinktree
                          | ContentActivities
                          | ContentDreams;

export interface ContentMap {
    __component: 'content.map'
    id: number
    iFrameCode: string
}

export interface ContentText {
    __component: 'content.text'
    id: number
    text: string
}
export interface ContentImage {
    __component: 'content.image'
    id: number
    image: Image
}
export interface ContentHeadline {
    __component: 'content.headline'
    id: number
    headline: string
    subline: string
}

export interface ContentTeaser {
    __component: 'content.teaser'
    id: number
    panels: StrapiRichtextParagraph[]
}

export interface ContentLinktree {
    __component: 'content.linktree'
    id: number
    links: StrapiRichtextParagraph[]
}

export interface ContentActivities {
    __component: 'content.activities'
    id: number
}

export interface ContentDreams {
    __component: 'content.dreams'
    id: number;
    Year: DreamYear;
}




export interface StrapiRichtextParagraph {
    type: 'paragraph'
    children: (StrapiRichtextText | StrapiRichtextLink)[];
}

export interface StrapiRichtextText {
    type: 'text'
    text: string
}
export interface StrapiRichtextLink {
    type: 'link'
    url: string
    children: StrapiRichtextText[]
}