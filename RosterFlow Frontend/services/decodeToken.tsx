import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string;
  roles: string[];
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};
