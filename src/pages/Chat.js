import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import Button from "styles/Button";
import Input from "styles/Input";
import MessageBubble from "components/MessageBubble";
import ChatEvent from "components/ChatEvent";
import WebSocketEventListenerStore from "lib/WebSocketEventListenerStore";

function useStayScrolled(scrollableElemRef, deps) {
  const chatScrolledToBottomRef = useRef(false);
  useEffect(() => {
    if (chatScrolledToBottomRef.current) {
      scrollableElemRef.current.scrollTop = scrollableElemRef.current.scrollHeight;
    }
  }, deps);
  useEffect(() => {
    const { scrollHeight, scrollTop, clientHeight } = scrollableElemRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight;
    chatScrolledToBottomRef.current = isAtBottom;
  });
}

function ChatPage({ user, ws }) {
  const [chatEvents, setChatEvents] = useState([]);

  useEffect(() => {
    const handleMsg = (evt) => {
      const { type, payload } = JSON.parse(evt.data);
      if (
        type === "CHAT_MSG_ADDED" ||
        type === "USER_JOINED" ||
        type === "USER_LOGOUT" ||
        type === "USER_LOGGED_OUT_DUE_TO_INACTIVITY" ||
        type === "USER_CONNECTION_CLOSED"
      ) {
        setChatEvents((state) => [...state, payload]);
      }
    };
    WebSocketEventListenerStore.on("message", handleMsg);
    return () => {
      WebSocketEventListenerStore.off("message", handleMsg);
    };
  }, []);

  // keep the chat scrolled to bottom when a new message appears for better UX
  // (I know that binding it to chatEvents array change instead of
  // the actual height of the element isn't the best solution, but it simpler
  // and will work for this task)
  const chatElemRef = useRef();
  useStayScrolled(chatElemRef, [chatEvents]);

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div
      style={{
        overflowY: "hidden",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        borderRight: "1px solid #dfe1e5",
        borderLeft: "1px solid #dfe1e5",
      }}
    >
      <Button
        style={{ margin: 10 }}
        theme="danger"
        onClick={() => {
          ws.send(
            JSON.stringify({
              type: "LOGOUT",
            })
          );
        }}
      >
        Logout
      </Button>

      <div
        style={{
          overflowY: "scroll",
          padding: "0 10px",
          display: "grid",
          gridGap: 10,
          alignContent: "start",
        }}
        ref={chatElemRef}
      >
        {!chatEvents.length && (
          <section
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#929396",
              lineHeight: "1.5rem",
              width: "100%",
            }}
          >
            No one has posted since you joined
            <br />
            You could be the first
          </section>
        )}
        {chatEvents.map((chatEvt) => {
          if (chatEvt.type === "USER_JOINED") {
            // using a date as a key is not the best, as in theory
            // there could be multiple events with the same date,
            // but for the purposes of this task, it should suffice
            return (
              <ChatEvent
                key={chatEvt.occurredAt}
                time={moment(chatEvt.occurredAt).format("HH:mm")}
                text={`${chatEvt.sourceUsername} joined the chat`}
              />
            );
          }
          if (chatEvt.type === "USER_LOGOUT") {
            return (
              <ChatEvent
                key={chatEvt.occurredAt}
                time={moment(chatEvt.occurredAt).format("HH:mm")}
                text={`${chatEvt.sourceUsername} left the chat`}
              />
            );
          }
          if (chatEvt.type === "USER_LOGGED_OUT_DUE_TO_INACTIVITY") {
            return (
              <ChatEvent
                key={chatEvt.occurredAt}
                time={moment(chatEvt.occurredAt).format("HH:mm")}
                text={`${chatEvt.targetUsername} disconnected due to inactivity`}
              />
            );
          }
          if (chatEvt.type === "USER_CONNECTION_CLOSED") {
            return (
              <ChatEvent
                key={chatEvt.occurredAt}
                time={moment(chatEvt.occurredAt).format("HH:mm")}
                text={`${chatEvt.sourceUsername} connection closed`}
              />
            );
          }
          if (chatEvt.type === "MSG_ADDED") {
            return (
              <MessageBubble
                key={chatEvt.occurredAt}
                occurredAt={moment(chatEvt.occurredAt).format("HH:mm:ss")}
                sender={chatEvt.sourceUsername}
                message={chatEvt.message}
                currentUserIsSender={chatEvt.sourceUsername === user.username}
              />
            );
          }
        })}
      </div>

      <form
        style={{
          flex: "0 0",
          display: "grid",
          margin: 10,
          gridGap: 10,
          gridTemplateColumns: "1fr auto",
        }}
        onSubmit={(evt) => {
          evt.preventDefault();

          ws.send(
            JSON.stringify({
              type: "SUBMIT_CHAT_MESSAGE",
              payload: { message: inputValue },
            })
          );
          setInputValue("");
        }}
      >
        <Input
          // not the best UX to set max length for such an input, I know
          maxLength={500}
          ref={inputRef}
          value={inputValue}
          placeholder="Type a message..."
          onChange={(evt) => setInputValue(evt.target.value)}
          style={{ gridRow: 1 }}
        />
        <Button style={{ gridRow: 1 }}>Send</Button>
      </form>
    </div>
  );
}

export default ChatPage;
