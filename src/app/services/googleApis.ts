import axios from "axios";
import QueryString from "qs";
import { ENV_VARS } from "../config/env";

interface IGetAccessTokenResponse {
  code: string;
  redirectUri: string;
}

interface IUserInfoResponse {
  email: string;
  verifiedEmail: string;
  firstName: string;
  lastName: string;
  googleId: string;
}

export class GoogleApis {
  static async getAccessToken({ code, redirectUri }: IGetAccessTokenResponse) {
    const options = QueryString.stringify({
      client_id: ENV_VARS.GOOGLE_CLIENT_ID,
      client_secret: ENV_VARS.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });

    const { data } = await axios.post<{ access_token: string }>(
      "https://oauth2.googleapis.com/token",
      options,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return data.access_token;
  }

  static async getUserInfo(accessToken: string): Promise<IUserInfoResponse> {
    const { data } = await axios.get(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      email: data.email,
      verifiedEmail: data.verified_email,
      firstName: data.given_name,
      lastName: data.family_name,
      googleId: data.id,
    };
  }

  static async revokeAccessToken(accessToken: string) {
    await axios.post(
      "https://oauth2.googleapis.com/revoke",
      QueryString.stringify({
        token: accessToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  }
}
