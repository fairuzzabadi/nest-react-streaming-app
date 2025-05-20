import styled, { ThemeProvider, keyframes } from "styled-components";
import themes from "./styles/themes";
import ThemeContext from "./contexts/theme";
import { useState, useEffect } from "react";
import router from "./router";
import { RouterProvider } from "react-router-dom";
import GlobalStyles from "./styles/globalStyles";

const grows = keyframes`
  form {
    transform: scale(0);
  } to {
    transform: scale(1);
  }
`;

const ThemeSwipper = styled.div<{ $color: string }>`
  z-index: -1;
  position: absolute;
  top: -50vh;
  right: -50vw;
  width: 200vw;
  height: 200vh;
  border-radius: 100%;
  background: ${({ $color }) => $color};
  transform: scale(0);
  transform-origin: top right;
  animation: ${grows} ${({ theme }) => `${theme.swipperTimeout}ms`} both;
`;

function App() {
  const [showSwipper, setShowSwipper] = useState(false);
  const preferredTheme = sessionStorage.getItem("theme");
  const [theme, setTheme] = useState<"dark" | "light">(
    preferredTheme === "dark" || preferredTheme === "light"
      ? preferredTheme
      : "dark"
  );

  useEffect(() => {
    document.body.style.background =
      theme === "dark"
        ? themes.colors.dark.background
        : themes.colors.light.background;
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme() {
          // begin animation
          setShowSwipper(true);

          setTheme((theme) => {
            const newTheme = theme === "light" ? "dark" : "light";
            sessionStorage.setItem("theme", newTheme);

            setTimeout(() => {
              setShowSwipper(false);

              const body = document.querySelector("body");
              if (body) {
                body.style.background =
                  theme === "light"
                    ? themes.colors.dark.background
                    : themes.colors.light.background;
              }
            }, themes.swipperTimeout);

            return newTheme;
          });
        },
      }}
    >
      <ThemeProvider
        theme={{
          ...themes,
          theme,
          colors: theme === "light" ? themes.colors.light : themes.colors.dark,
        }}
      >
        {showSwipper && (
          <ThemeSwipper
            $color={
              theme === "dark"
                ? themes.colors.dark.background
                : themes.colors.light.background
            }
          />
        )}
        <GlobalStyles />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
