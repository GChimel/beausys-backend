import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ENV_VARS } from "../config/env";
import { ClientService } from "../services/clientService";
import { CompanyService } from "../services/companyService";
import { RefreshTokenService } from "../services/refreshTokenService";

export class ClientController {
  static async register(request: FastifyRequest, reply: FastifyReply) {
    const schema = z.object({
      companyId: z.string().uuid(),
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      cellPhone: z.string(),
      googleId: z.string().optional(),
      photo: z.string().optional(),
    });

    const body = schema.parse(request.body);

    try {
      // Verify if company exists
      const company = await CompanyService.findById(body.companyId);

      if (!company) {
        return reply.code(404).send({ message: "Company not found" });
      }

      // Verify if client email already exists
      const emailExists = await ClientService.findByEmail(
        body.companyId,
        body.email
      );

      if (emailExists) {
        return reply.code(400).send({ message: "Email already exists" });
      }

      const hashedPassword = await hash(body.password, 8);

      const client = await ClientService.create({
        ...body,
        password: hashedPassword,
        registeredAt: new Date(),
      });

      const accessToken = await reply.jwtSign({
        sub: client.id,
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + Number(ENV_VARS.JWT_EXPIRES_IN));

      const { id: refreshToken } = await RefreshTokenService.create({
        clientId: client.id,
        expiresAt,
        issuedAt: new Date(),
      });

      return reply.code(201).send({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      throw error;
    }
  }

  static async findAll(request: FastifyRequest, reply: FastifyReply) {
    const { companyId } = z
      .object({
        companyId: z.string().uuid(),
      })
      .parse(request.query);

    try {
      const clients = await ClientService.findAll(companyId);

      return reply.status(200).send(clients);
    } catch (error) {
      throw error;
    }
  }

  static async findByName(request: FastifyRequest, reply: FastifyReply) {
    const { companyId } = z
      .object({
        companyId: z.string().uuid(),
      })
      .parse(request.query);

    const { clientName } = z
      .object({
        clientName: z.string(),
      })
      .parse(request.params);

    try {
      const clients = await ClientService.findByName(companyId, clientName);

      return reply.status(200).send(clients);
    } catch (error) {
      throw error;
    }
  }
}
