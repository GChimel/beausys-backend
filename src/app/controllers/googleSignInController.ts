import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ENV_VARS } from "../config/env";
import { prismaClient } from "../lib/prismaClient";
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

    const { verifiedEmail, ...userInfo } = await GoogleApis.getUserInfo(
      googleAccessToken
    );

    await GoogleApis.revokeAccessToken(googleAccessToken);

    if (!verifiedEmail) {
      return reply.status(400).send({ message: "Email not verified" });
    }

    // Update or create user in database

    const hashedPassword = await hash(userInfo.googleId, 8);

    const user = await prismaClient.user.upsert({
      where: {
        email: userInfo.email,
      },
      create: {
        createdAt: new Date(),
        email: userInfo.email,
        name: userInfo.firstName + " " + userInfo.lastName,
        password: hashedPassword,
        googleId: userInfo.googleId,
      },
      update: {
        googleId: userInfo.googleId,
      },
    });
  };
}
