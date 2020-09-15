import React, { useState, useEffect, useRef } from "react";
import Button from "styles/Button";
import Input from "styles/Input";
import ErrorNotice from "components/ErrorNotice";
import WebSocketEventListenerStore from "lib/WebSocketEventListenerStore";

function LandingPage({
  wsReadyState,
  ws,
  errorState: [parentError, setParentError],
}) {
  const [username, setUsername] = useState("");
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const [error, setError] = useState();
  useEffect(() => {
    const handleError = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === "ERROR") {
        setError(msg.error);
      }
    };

    WebSocketEventListenerStore.on("message", handleError);
    return () => {
      WebSocketEventListenerStore.off("message", handleError);
    };
  }, []);

  return (
    <form
      style={{
        display: "grid",
        gridGap: 8,
        alignSelf: "center",
        margin: "0 15px",
      }}
      onSubmit={(evt) => {
        evt.preventDefault();

        ws.send(JSON.stringify({ type: "JOIN_CHAT", payload: { username } }));
        setParentError(null);
        setError(null);
      }}
    >
      {(() => {
        if (wsReadyState === WebSocket.CONNECTING) {
          return "Connecting...";
        }
        if (wsReadyState === WebSocket.CLOSED) {
          return <ErrorNotice text="No server connection" />;
        }
        if (parentError) {
          return <ErrorNotice text={parentError.message} />;
        }
        if (error) {
          return <ErrorNotice text={error.message} />;
        }
      })()}

      <label style={{ display: "grid", gridGap: 3 }}>
        Username
        <Input
          maxLength={30}
          ref={inputRef}
          value={username}
          onChange={(evt) => setUsername(evt.target.value)}
        />
      </label>
      <Button disabled={wsReadyState !== WebSocket.OPEN}>Join</Button>
    </form>
  );
}

export default LandingPage;
