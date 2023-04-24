export interface PaginatedResponse {
  totalCount: number;
  page: number;
  limit: number;
  data: any[];
  [prop: string]: any;
}
