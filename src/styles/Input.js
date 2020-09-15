import styled from "styled-components";
import { Colors } from "styles/variables";

const Input = styled.input`
  border-radius: 10000px;
  padding: 10px 20px;
  outline: none;
  border: 1px solid #dfe1e5;

  /* &:hover {
    border-color: ${Colors.primary400};
  } */
  &:focus {
    border-color: ${Colors.primary500};
  }
`;

export default Input;
