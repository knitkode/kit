"use client";

import { useContext } from "react";
import { ThemeContext, type ThemeContextProps } from "./ThemeContext";

export type UseThemeProps = ThemeContextProps;

/**
 * @borrows [next-themes](https://github.com/pacocoursey/next-themes)
 */
export const useTheme = () => useContext(ThemeContext);

export default useTheme;
