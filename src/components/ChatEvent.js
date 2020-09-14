import React from "react";

function ChatEvent({ time, text }) {
  return (
    <section style={{ color: "#929396", textAlign: "center", wordBreak: 'break-all' }}>
      {time} {text}
    </section>
  );
}

export default ChatEvent;
