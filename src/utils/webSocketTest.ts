import { useEffect } from "react";
import { io } from "socket.io-client";

export default function WebSocketTest() {
  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Conectado al websocket");
      socket.emit("message", "¡Hola desde el frontend!");
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del websocket");
      socket.emit("message", "¡Adiós desde el frontend!");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}