import { genSalt, hash } from "bcrypt"

export async function encriptarPasswd(password: string) {
    const cantidadDeSaltos = await genSalt(10)
    const passwdHash = await hash(password, cantidadDeSaltos);

    return passwdHash;
}