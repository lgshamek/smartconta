// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: "#eef8ff",
    100: "#d6eeff",
    200: "#b4e2ff",
    300: "#8ad4ff",
    400: "#5cc3ff",
    500: "#2196f3", // primary
    600: "#1b6fc0",
    700: "#155793",
    800: "#0f3b66",
    900: "#08253a",
  },
};

const theme = extendTheme({ config, colors });

export default theme;
