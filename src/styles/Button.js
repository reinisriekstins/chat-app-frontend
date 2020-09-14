import styled from "styled-components";
import { Colors } from "styles/variables";

const Button = styled.button`
  cursor: pointer;
  border-radius: 10000px;
  padding: 10px 20px;
  outline: none;
  border: none;
  background: ${props => Colors[`${props.theme}500`]};
  color: white;

  &:focus {
    background: ${props => Colors[`${props.theme}600`]};
  }
  &[disabled] {
    background: ${props => Colors[`${props.theme}200`]};
    cursor: not-allowed;
  }
`;

Button.defaultProps = {
  theme: 'primary',
};

export default Button;
