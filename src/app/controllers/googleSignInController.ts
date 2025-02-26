import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ENV_VARS } from "../config/env";
import { GoogleApis } from "../services/googleApis";

export class GoogleSignInController {
  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({
      code: z.string().min(1),
    });

    const { code } = schema.parse(request.query);

    const googleAccessToken = await GoogleApis.getAccessToken({
      code,
      redirectUri: ENV_VARS.GOOGLE_REDIRECT_URI!,
    });
  };
}
