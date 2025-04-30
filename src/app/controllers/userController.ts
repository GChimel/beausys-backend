import { compare, hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getUserId } from "../helper/getUserId";
import { AbacatePayService } from "../services/abacatePayService";
import { UserService } from "../services/userService";

export class UserController {
  static async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z
      .object({
        id: z.string().uuid(),
      })
      .parse(request.params);

    const schema = z.object({
      name: z.string(),
      taxId: z.string().min(11),
      email: z.string().email(),
      password: z.string().min(6),
      new_password: z.string().min(6),
      cellPhone: z.string(),
    });

    const { name, email, password, cellPhone, new_password, taxId } =
      schema.parse(request.body);

    try {
      const emailExists = await UserService.findByEmail(email);

      if (emailExists) {
        return reply.code(406).send({ message: "Email already exists" });
      }

      const user = await UserService.findById(id);

      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

      const verifyPassword = await compare(password, user.password);

      if (!verifyPassword) {
        return reply.code(401).send({ message: "Current password incorrect" });
      }

      const hashPassword = await hash(new_password, 8);

      const updatedUser = await UserService.update(id, {
        name,
        email,
        cellPhone,
        taxId,
        password: hashPassword,
      });

      // Update user in AbacatePay
      try {
        await AbacatePayService.createUser({
          name,
          email,
          cellphone: cellPhone,
          taxId,
        });
      } catch (error) {
        console.error("Failed to update user in AbacatePay:", error);
      }

      return reply.code(200).send(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  static async findById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = z
      .object({
        id: z.string().uuid({ message: "Invalid id" }),
      })
      .parse(request.params);

    const userId = getUserId(request);

    try {
      // Verify if user exists
      const user = await UserService.findById(id);

      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }

      if (user.id !== userId) {
        return reply.code(403).send({ message: "Forbidden" });
      }

      return reply.status(200).send(user);
    } catch (error) {
      throw error;
    }
  }
}
