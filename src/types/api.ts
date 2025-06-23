export type AuthCheckResponse = {
  is_login: boolean;
  id: number;
  email: string;
};

export type ApiCallOptions = {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  url: string;
  body?: any;
  tags?: string[];
};
