import React, { useState, useRef, useEffect } from "react";
import LandingPage from "pages/Landing";
import ChatPage from "pages/Chat";
import WebSocketEventListenerStore from "lib/WebSocketEventListenerStore";

const initWebsocket = (ref, setWsReadyState) => {
  const ws = new WebSocket("ws://localhost:8080");
  ref.current = ws;

  
  const errHandler = (evt) => {
    setWsReadyState(ws.readyState);
    WebSocketEventListenerStore.emit("error", evt);
  };
  const openHandler = (evt) => {
    setWsReadyState(ws.readyState);
    WebSocketEventListenerStore.emit("open", evt);
  };
  const msgHandler = (evt) => {
    WebSocketEventListenerStore.emit("message", evt);
  };
  const closeHandler = (evt) => {
    setWsReadyState(ws.readyState);
    WebSocketEventListenerStore.emit("close", evt);
    ws.removeEventListener("error", errHandler);
    ws.removeEventListener("open", openHandler);
    ws.removeEventListener("message", msgHandler);
    ws.removeEventListener("close", closeHandler);
  };

  ws.addEventListener("error", errHandler);
  ws.addEventListener("open", openHandler);
  ws.addEventListener("message", msgHandler);
  ws.addEventListener("close", closeHandler);
};

function App() {
  const [wsReadyState, setWsReadyState] = useState(WebSocket.CONNECTING);

  // This state will be used to track
  // the "logged in" status of this client.
  // If I would want to make this persistent,
  const [user, setUser] = useState();

  // Display landing page if it's disconnected from the server
  useEffect(() => {
    if (user && wsReadyState !== WebSocket.OPEN) {
      setUser(null);
    }
  }, [wsReadyState, user]);

  useEffect(() => {
    WebSocketEventListenerStore.on("message", (evt) => {
      const msg = JSON.parse(evt.data);
      const { type, error, payload } = msg;

      switch (type) {
        case "JOIN_SUCCESS":
          setUser(payload.user);
          break;
        case "LOGOUT_SUCCESS":
        case "LOGOUT_DUE_TO_INACTIVITY":
          setUser(null);
          break;
        case "ERROR":
          console.error(error);
          break;
        default:
          return;
      }
    });
  }, []);

  const wsRef = useRef();
  // It was unclear in the task description, whether
  // the client should try to connect to the server instantly
  // or when the user tries to join the chat, however
  // the "instantly" approach just seems more logical
  // and better from a UX perspective
  useEffect(() => initWebsocket(wsRef, setWsReadyState), []);

  // Attempt reconnecting every 5 seconds, if connection is broken
  useEffect(() => {
    if (wsReadyState === WebSocket.CLOSED) {
      const interval = setInterval(() => initWebsocket(wsRef, setWsReadyState), 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [wsReadyState]);
  const ws = wsRef.current;

  return (
    <div
      style={{
        height: "100vh",
        maxWidth: 500,
        margin: "auto",
        display: "grid",
      }}
    >
      {(() => {
        if (user) {
          return <ChatPage user={user} ws={ws} />;
        }
        return <LandingPage wsReadyState={wsReadyState} ws={ws} />;
      })()}
    </div>
  );
}

export default App;
