import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../../components";
import { Sidebar } from "./components";
import themes from "../../styles/themes";
import { darken, lighten } from "polished";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100dvh;

  & > * {
    flex-grow: 1;
  }

  main {
    overflow-y: auto;
  }

  .outlet {
    padding-left: 3rem;

    @media (max-width: ${themes.screen.s}) {
      padding-left: 1.5rem;
    }

    & > div > h1 {
      color: ${({ theme }) => theme.colors.primary};
      display: flex;
      align-items: center;
      gap: 1rem;
      font-weight: unset;
      letter-spacing: 2px;

      @media (max-width: ${themes.screen.s}) {
        font-size: 1.5rem;
        letter-spacing: unset;
        position: sticky;
        padding: 5px 0;
        top: 0;
        right: 0;
        z-index: 1;
        border-top: 2px solid
          ${({ theme }) =>
            theme.theme === "light"
              ? darken(0.1, theme.colors.background)
              : lighten(0.1, theme.colors.background)};
        border-bottom: 2px solid
          ${({ theme }) =>
            theme.theme === "light"
              ? darken(0.1, theme.colors.background)
              : lighten(0.1, theme.colors.background)};
        background: ${({ theme }) =>
          theme.theme === "light"
            ? darken(0.05, theme.colors.background)
            : lighten(0.05, theme.colors.background)};
        transform: translateX(-1.5rem);
        padding-left: 1rem;

        &:after {
          position: absolute;
          display: block;
          content: "";
          width: 3rem;
          transform: translateX(-50%);
          height: 100%;
          background: ${({ theme }) =>
            theme.theme === "light"
              ? darken(0.05, theme.colors.background)
              : lighten(0.05, theme.colors.background)};
          left: 100%;
          border-top: 2px solid
            ${({ theme }) =>
              theme.theme === "light"
                ? darken(0.1, theme.colors.background)
                : lighten(0.1, theme.colors.background)};
          border-bottom: 2px solid
            ${({ theme }) =>
              theme.theme === "light"
                ? darken(0.1, theme.colors.background)
                : lighten(0.1, theme.colors.background)};
        }
      }
    }
  }
`;

function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <Container>
      <Sidebar show={showSidebar} hide={() => setShowSidebar(false)} />
      <main>
        <Header showSidebar={() => setShowSidebar(true)} />
        <div id="player-container"></div>
        <div className="outlet">
          <Outlet />
        </div>
      </main>
    </Container>
  );
}

export default Dashboard;
