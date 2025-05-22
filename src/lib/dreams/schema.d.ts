export interface DreamYear {
  id:number,
  documentId:string,
  name:string,
  budget:number,
  dreams: Dream[],
}
export interface Dream {
  id:number,
  documentId:string,
  name:string,
  budgetNeed: 'MUST' | 'NICE' | 'NONE';
  requestMin:number,
  requestMax:number,
  grant:number,
  grantStatus: 'OPEN' | 'DENIED' | 'ACCEPTED' | 'INVOICES' |  'PAID';
  shortDescription: string,
  dreamer: string,
  dreamType: 'ART','ROOM','WORKSHOP','OTHER';
}