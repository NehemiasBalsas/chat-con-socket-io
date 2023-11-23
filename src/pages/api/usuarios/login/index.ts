import { compare } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { emailRegex, passwdRegex } from "@/utils/regex";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
type RespuestaLogin =
  | {
      token: string;
      authorized: boolean;
    }
  | {
      msg: string;
    };

export default async function backLogin(req: NextApiRequest, res: NextApiResponse<RespuestaLogin>) {
    const usuario = req.body;

    if (!usuario.email.match(emailRegex))
    return res.status(400).json({ msg: "Email Invalido"})
    if (!usuario.password.match(passwdRegex))
    return res.status(400).json({ msg: "Contraseña Invalida"})

    const usuarioEnDb = await prisma.usuarios.findUnique({
        where: {
            email: usuario.email,
        }
    });

    if (!usuarioEnDb)
    return res.status(400).json({ msg: "Esta cuenta no existe, registrate"});

    const contraseñaValida = await compare(
        usuario.password,
        usuarioEnDb.password
    );

    if (!contraseñaValida)
    return res.status(401).json({ msg: "Contraseña incorrecta!" });

    const token = sign(usuarioEnDb, process.env.TOKEN_SECRET as string, {
        expiresIn: "1d",
    });

    res.status(200).json({token, authorized: true})

}