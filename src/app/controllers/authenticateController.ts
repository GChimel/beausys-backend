import { compare, hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ENV_VARS } from "../config/env";
import { AuthenticationError } from "../errors/authenticateError";
import { prismaClient } from "../lib/prismaClient";
import { GoogleApis } from "../services/googleApis";

export class AuhtenticateController {
  static signIn = async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = schema.parse(request.body);

    try {
      const user = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new AuthenticationError();
      }

      const comparePassword = await compare(password, user.password);

      if (!comparePassword) {
        throw new AuthenticationError();
      }

      const accessToken = await reply.jwtSign({
        sub: user.id,
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(ENV_VARS.JWT_EXPIRES_IN));

      const { id: refreshToken } = await prismaClient.refreshToken.create({
        data: {
          userId: user.id,
          expiresAt,
          issuedAt: new Date(),
        },
      });

      return reply.code(200).send({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return reply.code(401).send({
          error: true,
          message: error.message,
        });
      }
      throw error;
    }
  };

  static signUp = async (request: FastifyRequest, reply: FastifyReply) => {
    const schema = z.object({
      name: z.string().min(4),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password, name } = schema.parse(request.body);

    try {
      const userExists = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });

      if (userExists) {
        return reply.code(400).send({
          error: true,
          message: "User already exists",
        });
      }

      const hashedPassword = await hash(password, 8);

      const user = await prismaClient.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const accessToken = await reply.jwtSign({
        sub: user.id,
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(ENV_VARS.JWT_EXPIRES_IN));

      const { id: refreshToken } = await prismaClient.refreshToken.create({
        data: {
          userId: user.id,
          expiresAt,
          issuedAt: new Date(),
        },
      });

      return reply.code(201).send({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      throw error;
    }
  };

  static googleSignIn = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
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
      return reply.code(400).send({ message: "Email not verified" });
    }

    const hashedPassword = await hash(userInfo.googleId, 8);

    // Update or create user in database
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

    const accessToken = await reply.jwtSign({ sub: user.id });

    return reply.code(200).send({ accessToken });
  };

  static refreshToken = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const schema = z.object({
      refreshToken: z.string().uuid(),
    });

    const { refreshToken: refreshTokenId } = schema.parse(request.body);

    try {
      const refreshToken = await prismaClient.refreshToken.findUnique({
        where: {
          id: refreshTokenId,
        },
      });

      if (!refreshToken) {
        return reply.code(400).send({
          error: true,
          message: "Invalid refresh token",
        });
      }

      if (Date.now() > refreshToken.expiresAt.getTime()) {
        return reply.code(404).send({
          error: true,
          message: "Refresh token expired",
        });
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(ENV_VARS.JWT_EXPIRES_IN));

      const [accessToken, newRefreshToken] = await Promise.all([
        reply.jwtSign({ sub: refreshToken.userId }),
        prismaClient.refreshToken.create({
          data: {
            userId: refreshToken.userId,
            expiresAt,
            issuedAt: new Date(),
          },
        }),
        prismaClient.refreshToken.delete({
          where: {
            id: refreshToken.id,
          },
        }),
      ]);

      return reply.status(200).send({
        accessToken,
        refreshToken: newRefreshToken.id,
      });
    } catch (error) {
      throw error;
    }
  };
}
