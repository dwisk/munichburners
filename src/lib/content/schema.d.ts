export type ContentType = ContentMap | ContentText;

export interface ContentMap {
    __component: 'content.map'
    id: number
    iFrameCode: string
}

export interface ContentText {
    __component: 'content.text'
    id: number
    textDE: string
    textEN: string
}
