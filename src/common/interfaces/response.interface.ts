export interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  errors?: any[];
}

export interface IAuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface IArticleResponse {
  id: number;
  title: string;
  description: string;
  publicationDate: Date;
  author: {
    id: number;
    name: string;
  };
}

export interface IPaginatedArticleResponse {
  items: IArticleResponse[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
