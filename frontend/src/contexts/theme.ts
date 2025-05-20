import { createContext } from "react";

type ContextType = {
  theme: "dark" | "light";
  toggleTheme: () => void;
};

const ThemeContext = createContext<ContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export default ThemeContext;
