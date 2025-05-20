const themes = {
  colors: {
    light: {
      background: "white",
      cardBg: "#787878",
      logo: "red",
      inputBg: "grey",
      placeholder: "rgba(255, 255, 255, 0.75)",
      opposite: "white",
      primary: "#121212",
      secondary: "#30475E",
      secondaryVariant: "#7899ba",
      tertiary: "#F5F5F5",
      quaternary: "#F05454",
      playButton: "#f9bbbb",
    },
    dark: {
      background: "#0f0f0f",
      cardBg: "#303030",
      logo: "red",
      inputBg: "grey",
      placeholder: "rgba(255, 255, 255, 0.75)",
      opposite: "black",
      primary: "#bebebe",
      secondary: "#456687",
      secondaryVariant: "#7899ba",
      tertiary: "#4a4a4a",
      quaternary: "#F05454",
      playButton: "#f9bbbb",
    },
  },
  sizes: {
    inputWidth: "280px",
    video: {
      maxHeight: "360px",
      cover: {
        width: "160px",
        height: "96px",
      },
    },
  },
  swipperTimeout: 1000,
  modal: {
    width: "480px",
  },
  screen: {
    xs: "375px",
    s: "426px",
    m: "768px",
    l: "1024px",
    xl: "1440px",
  },
};

export default themes;
