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
  requestMin:number,
  requestMax:number,
  grant:number,
  grantStatus: 'OPEN' | 'DENIED' | 'ACCEPTED' | 'INVOICES' | 'PAID';
  shortDescription: string,
  dreamer: string;
  dreamType: 'ART' | 'ROOM' | 'WORKSHOP' | 'OTHER';
  timestamp: string,
  email: string,
  dreamerSecret?: string,
  invoices?: DreamInvoice[],
}

export interface DreamInvoice {
  id?:number,
  Comment:string,
  File: {
    name:string,
    url:string,
  }
  Amount:number
}