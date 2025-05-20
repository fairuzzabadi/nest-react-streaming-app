import { darken, lighten, transparentize } from "polished";
import styled, { keyframes } from "styled-components";
import themes from "../styles/themes";

const appear = keyframes`
0% {
  transform: translate(-50%, -50%) scale(0.5);
} 100% {
  transform: translate(-50%, -50%) scale(1);
}
`;

const slideUp = keyframes`
from {
  opacity: 0;
  transform: translateY(50%);
} to {
  opacity: 1;
  transform: translateY(0);
}
`;

const StyledModal = styled.div`
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 10px;
  max-width: ${({ theme }) => theme.modal.width};
  animation: ${appear} 250ms both ease;
  background: ${({ theme }) =>
    transparentize(
      0.05,
      theme.theme === "light"
        ? theme.colors.background
        : lighten(0.1, theme.colors.background)
    )};
  box-shadow: 0 5px 15px
    ${({ theme }) =>
      theme.theme === "light"
        ? darken(0.25, theme.colors.background)
        : lighten(0.25, theme.colors.background)};

  @media (max-width: ${themes.screen.s}) {
    width: 100%;
    animation: unset;
    top: unset;
    bottom: 0;
    left: 0;
    animation: ${slideUp} 250ms both;

    h1 {
      font-size: 1.25rem !important;
      padding-top: 0.75rem !important;
      padding-bottom: 0.5rem !important;
    }
  }

  h1 {
    font-size: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: unset;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.25, theme.colors.background)
          : lighten(0.25, theme.colors.background)};

    button {
      all: unset;
      cursor: pointer;
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 2rem;
      transition: background 300ms;

      &:hover {
        background: ${({ theme }) =>
          theme.theme === "light"
            ? darken(0.25, theme.colors.background)
            : lighten(0.25, theme.colors.background)};
      }
    }
  }
`;

export default StyledModal;
