import { styled } from "styled-components";

const Button = styled.button`
  padding: 0.5rem 0;
  cursor: pointer;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.opposite};
  background: ${({ theme }) => theme.colors.primary};
  transition: background 500ms;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

export default Button;
