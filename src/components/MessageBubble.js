import React from "react";
import styled from "styled-components";
import { Colors } from "styles/variables";

const MessageBubbleStyle = styled.section`
  border-radius: 22px 22px
    ${(props) => (props.currentUserIsSender ? "2px 22px" : "22px 2px")};
  background: ${(props) =>
    props.currentUserIsSender ? Colors.info500 : Colors.success500};
  color: white;
  padding: 15px;
  margin: 0
    ${(props) => (props.currentUserIsSender ? "0 0 20px" : "20px 0 0")};
  display: grid;
  word-break: break-all;
`;

function MessageBubble({ sender, message, occurredAt, currentUserIsSender }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: currentUserIsSender ? "flex-end" : "flex-start",
      }}
    >
      <MessageBubbleStyle currentUserIsSender={currentUserIsSender}>
        <span style={{ fontWeight: "bold" }}>{currentUserIsSender ? 'You' : sender}</span>
        {message}
      </MessageBubbleStyle>
    </div>
  );
}

export default MessageBubble;
