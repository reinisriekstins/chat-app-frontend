import React from "react";
import styled from "styled-components";
import { Colors } from "styles/variables";

const ErrorNoticeStyle = styled.div`
  background: ${Colors.danger500};
  color: white;
  padding: 15px;
`;

function ErrorNotice({ title, text }) {
  return (
    <ErrorNoticeStyle>
      {title && (
        <strong style={{ display: "block", marginBottom: 5 }}>title</strong>
      )}
      {text}
    </ErrorNoticeStyle>
  );
}

export default ErrorNotice;
