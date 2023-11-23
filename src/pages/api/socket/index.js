import { Server } from "socket.io";

export default function ManejadorDeSockets(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

io.on("connection", (socket) => {
  console.log(`Usuario conectado en el socket: ${socket.id}`);

  io.emit("conectados", obtenerUsuariosConectados());

  socket.on("disconnect", () => {
    io.emit("conectados", obtenerUsuariosConectados());
  });

  socket.on("chat:mensaje", (mensaje) => {
    io.emit("chat:mensaje", mensaje);
  });

  console.log("Usuarios conectados:", obtenerUsuariosConectados());
});
  
function obtenerUsuariosConectados() {
  const usuariosConectados = [];
  io.sockets.sockets.forEach((socket) => {
    usuariosConectados.push({
      id: socket.id,
      username: socket.handshake.auth.username,
    });
  });
  console.log("Usuarios conectados:", usuariosConectados);
  return usuariosConectados;
}


  res.end();
}
