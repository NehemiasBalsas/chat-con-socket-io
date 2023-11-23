import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Image from "next/image";
import css from "@/styles/css.module.css";

const urlRegex =
  /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

export default function Index() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [todosLosMensajes, setTodosLosMensajes] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      iniciarSockets();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  async function iniciarSockets() {
    console.log("Iniciando sockets...");

    await fetch("/api/socket");

    const newSocket = io();
    setSocket(newSocket);

    console.log("Socket conectado:", newSocket.id);

    newSocket.on("chat:mensaje", (mensajeNuevo) => {
      console.log("Mensaje recibido:", mensajeNuevo);
      setTodosLosMensajes((mensajesAnteriores) => [
        ...mensajesAnteriores,
        mensajeNuevo,
      ]);
    });
  }

  function manejarEnvioDeMensaje(evento) {
    evento.preventDefault();

    console.log("Mensaje enviado!");

    if (socket) {
      socket.emit("chat:mensaje", { username, contenido: message });
    }

    setMessage("");
  }

  return (
    <div className={css.main}>
      <section className={css.Section}>
        <h1 className={css.title}>Aplicacion de Chat</h1>

        <form onSubmit={manejarEnvioDeMensaje} action="" className="text-black">
          <input
            onChange={(evento) => setUsername(evento.target.value)}
            type="text"
            className={css.nombre}
            name="nombre" // Asegúrate de que 'nombre' esté definido como atributo 'name'
            id="nombre"
            placeholder="Username"
          />

          <ul className={css.ul}>
            {todosLosMensajes.map((mensaje, index) => (
              <li key={index} className={css.li}>
                {mensaje.contenido.match(urlRegex) ? (
                  <>
                    {mensaje.username}: <br />
                    <Image
                      src={mensaje.contenido}
                      alt=""
                      width={700}
                      height={700}
                    />
                  </>
                ) : (
                  <span>
                    {mensaje.username}: {mensaje.contenido}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className={css.contenedorSms}>
            <input
              onChange={(evento) => setMessage(evento.target.value)}
              value={message}
              className={css.sms}
              type="text"
              name="mensaje" // Asegúrate de que 'mensaje' esté definido como atributo 'name'
              id="mensaje"
              placeholder="Mensaje"
            />
            <input
              type="submit"
              className={css.Enviar}
              value="Enviar mensaje"
            />
          </div>
        </form>
      </section>
    </div>
  );
}
