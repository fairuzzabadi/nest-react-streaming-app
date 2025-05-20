import { transparentize } from "polished";
import { styled } from "styled-components";

const Container = styled.p`
  font-size: 1.75rem;
  margin: 1.25rem 0;

  span {
    padding: 1rem;
    // border: 1px solid ${({ theme }) => theme.colors.secondary};
    box-shadow: 0 0 2px
      ${({ theme }) => transparentize(0.5, theme.colors.primary)};
    display: grid;
    place-items: center;
    max-width: 28px;
    aspect-ratio: 1;
    border-radius: 15px;
  }
`;

function Icon({ children }: { children: React.JSX.Element }) {
  return (
    <Container>
      <span>{children}</span>
    </Container>
  );
}

export default Icon;
