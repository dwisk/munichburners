import { ContentType } from "../content/schema";

export interface Activity {
  id:number,
  documentId:string,
  locale:'en'|'de-DE',
  name:string,
  startDate:string,
  endDate:string,
  location:string,
  shortDescription:string,
  description:string,
  content: ContentType[]
}