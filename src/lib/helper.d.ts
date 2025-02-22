export type RelationSingle<T> = {
    data: T;
};

export type RelationMany<T> = {
    data: Array<T>;
}


export type StrapiPagination = {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
    withCount?: boolean | string;
  };
  
  export type StrapiResponseMetaPagination = TypeResult<
    Pick<StrapiPagination, "page" | "pageSize" | "start" | "limit"> & {
      pageCount?: number;
      total?: number;
    }
  >;
  
  export type StrapiResponseMeta = {
    pagination: StrapiResponseMetaPagination;
  };

  export type StringMap<Type> = Record<string, Type>;