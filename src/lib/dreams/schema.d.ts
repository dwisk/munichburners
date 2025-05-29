export interface DreamYear {
  id:number,
  slug:string,
  documentId:string,
  name:string,
  budget:number,
  dreams: Dream[],
  realizers: [{
    Name: string,
    Secret: string,
  }]
}
export interface Dream {
  id?:number,
  CSVid?:number,
  documentId?:string,
  dream_year?:string | DreamYear,
  name:string,
  budgetNeed: 'MUST' | 'NICE' | 'NONE';
  requestMin?:number,
  requestMinReason?: string,
  requestMax?:number,
  requestMaxReason?: string,
  grant?:number,
  grantStatus?: 'OPEN' | 'DENIED' | 'ACCEPTED' | 'INVOICES' | 'READY' | 'PAID';
  shortDescription: string,
  dreamer: string;
  dreamType: 'ART' | 'ROOM' | 'WORKSHOP' | 'OTHER';
  timestamp: string,
  email: string,
  dreamerSecret?: string,
  invoices?: DreamInvoice[],
  invoiceComment?: string,
  comment?:string
  bankIBAN?: string,
  bankBIC?: string,
  bankName?: string,
}

export interface DreamInvoiceUpload {
  invoices: DreamInvoice[],
}

export interface DreamInvoice {
  id?:number,
  Comment:string,
  File: StrapiFile | string | number,
  Amount:number,
  reviewStatus: 'REVIEW' | 'ACCEPTED' | 'DENIED';
}

export interface StrapiFile {
  id: number;
  name: string;
  url: string;
}