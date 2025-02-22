import { Image } from "../pages/schema";

export type ContentType = ContentMap | ContentText | ContentImage;

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
