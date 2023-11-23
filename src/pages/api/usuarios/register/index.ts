import { emailRegex, passwdRegex } from "@/utils/regex"
import { log } from "console"
import { encriptarPasswd } from "@/utils/crypt"
import { PrismaClient, Usuarios } from "@prisma/client"
import { sign } from "jsonwebtoken"
import { NextApiRequest, NextApiResponse } from "next";

type suario = {
  nombreCompleto: string;
  email: string;
  password: string;
};

type RegisterResponse =
  | {
      token: string;
    }
  | {
      msg: string;
    };

export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
) {
    const prisma = new PrismaClient()
  const usuario: Usuarios = req.body;

  if (Object.values(usuario).includes("undefined"))
    return res.status(400).json({ msg: "Error! Not enough data" });

  if (!usuario.email.match(emailRegex))
    return res.status(400).json({ msg: "Error! Invalid email" });

  if (!usuario.password.match(passwdRegex))
    return res.status(400).json({ msg: "Invalid password" });

  const hash = await encriptarPasswd(usuario.password);

  const userAGuardar = { ...usuario, password: hash };

  const userSubido = await prisma.usuarios.create({ data: userAGuardar });

  if (!userSubido) return res.status(500).json({ msg: "Error in database" });

  const token = sign(userAGuardar, process.env.TOKEN_SECRET as string);

  res.status(201).json({ token });
   prisma.$disconnect();
}