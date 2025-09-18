import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  id: string;
  email: string;
  role: "ADMIN" | "VOTER" | "CANDIDATE";
  name: string;
  iat: number;
  exp: number;
};

const decodeJWT = (token: string): TokenPayload => {
  return jwtDecode<TokenPayload>(token);
};

export default decodeJWT;
