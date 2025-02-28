import { ContentType } from "../content/schema";

export interface RootPage {
  id:number,
  locale:'en'|'de-DE',
  content: ContentType[],
}

export interface Page extends RootPage {
  slug:string,
  documentId:string,
  name:string,
  childPages: ChildPage[],
  coverImage: Image,
  background: Image,
  showSignet: boolean
}
export interface ChildPage {
  id: number,
  title: string
  page: Page,
}

export interface Image {
  id:number,
  documentId:string,
  name:string,
  alternativeText:string,
  caption:string,
  width:number,
  height:number,
  formats: {
    thumbnail: ImageFormat,
    medium: ImageFormat,
    small: ImageFormat,
    large: ImageFormat,
  },
  hash:string,
  ext:string,
  mime:string,
  size:number,
  url:string,
  previewUrl:string,
  provider:string,
  provider_metadata:string,
  createdAt:string,
  updatedAt:string,
  publishedAt:string,
}

export interface ImageFormat {
  name:string,
  hash:string,
  ext:string,
  mime:string,
  path:string,
  width:number,
  height:number,
  size:number,
  sizeInBytes:number,
  url:string,
}

