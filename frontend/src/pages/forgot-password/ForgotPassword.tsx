import { styled } from "styled-components";
import { Outlet } from "react-router-dom";
import themes from "../../styles/themes";
import { transparentize } from "polished";

const Container = styled.div`
  width: 100vw;
  height: 100dvh;
  display: flex;
  background: ${({ theme }) => theme.colors.background};

  & > div {
    flex-grow: 1;
  }
`;

const Card = styled.div`
  max-width: 360px;
  margin: 0 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  position: relative;

  @media (max-width: ${themes.screen.s}) {
    margin: 0 auto;
    padding: 10vh 1rem;
    justify-content: flex-start;
    background: ${({ theme }) => transparentize(0.25, theme.colors.background)};
    z-index: 1;

    h1 {
      font-size: 1.75rem;
    }
  }
`;

const Image = styled.div`
  background: url(/images/backgrounds/forgot-pwd-bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin: 5px;

  @media (max-width: ${themes.screen.s}) {
    all: unset;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url(/images/backgrounds/typing.jpg);
    filter: blur(2px);
    background-size: cover;
  }
`;

function ForgotPassword() {
  return (
    <Container>
      <Card>
        <Outlet />
      </Card>
      <Image />
    </Container>
  );
}

export default ForgotPassword;
