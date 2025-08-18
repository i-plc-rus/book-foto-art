export interface IAuthLogin {
  email: string;
  password: string;
}

export interface IAuthLoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface IAuthRefreshResponse {
  access_token: string;
}

export interface IAuthRegister {
  username: string | null;
  email: string | null;
  password: string | null;
}
