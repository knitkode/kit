"use client";

import NextScript from "next/script";
import { memo, useCallback, useEffect, useState } from "react";
import { isServer } from "@koine/utils";
import { ThemeContext } from "./ThemeContext";

type ValueObject = {
  [themeName: string]: string;
};

const colorSchemes = ["light", "dark"];
const MEDIA = "(prefers-color-scheme: dark)";
const THEME_STORAGE_KEY = "theme";

export type ThemeProviderProps = React.PropsWithChildren<{
  /** List of all available theme names */
  themes?: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string;
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean;
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: string;
  /** HTML attribute modified based on the active theme. Accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.) */
  attribute?: string | "class";
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject;
  /** Nonce string to pass to the inline script for CSP headers */
  nonce?: string;
}>;

/**
 * @borrows [next-themes](https://github.com/pacocoursey/next-themes)
 *
 * Differences:
 *
 * - enableColorScheme: `false` by default (instead of `true`), this plays more
 * nicely with tailwind `dark` class mode as dark theme is supposed to be only
 * controlled by tailwind modifiers
 */
export const ThemeProvider = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme,
  themes = ["light", "dark"],
  defaultTheme = enableSystem ? "system" : "light",
  attribute = "data-theme",
  value,
  children,
  nonce,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState(() =>
    getTheme(THEME_STORAGE_KEY, defaultTheme),
  );
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    getTheme(THEME_STORAGE_KEY),
  );
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = useCallback(
    (theme?: (typeof themes)[number]) => {
      let resolved = theme;
      if (isServer || !resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === "system" && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation() : null;
      const d = document.documentElement;

      if (attribute === "class") {
        d.classList.remove(...attrs);

        if (name) d.classList.add(name);
      } else {
        if (name) {
          d.setAttribute(attribute, name);
        } else {
          d.removeAttribute(attribute);
        }
      }

      if (enableColorScheme) {
        const fallback = colorSchemes.includes(defaultTheme)
          ? defaultTheme
          : "";
        const colorScheme = colorSchemes.includes(resolved)
          ? resolved
          : fallback;
        d.style.colorScheme = colorScheme;
      }

      enable?.();
    },
    [
      attribute,
      attrs,
      defaultTheme,
      disableTransitionOnChange,
      enableColorScheme,
      enableSystem,
      value,
    ],
  );

  const setTheme = useCallback((theme: (typeof themes)[number]) => {
    setThemeState(theme);

    // Save to storage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // Unsupported
    }
  }, []);

  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme(e);
      setResolvedTheme(resolved);

      if (theme === "system" && enableSystem && !forcedTheme) {
        applyTheme("system");
      }
    },
    [theme, enableSystem, forcedTheme, applyTheme],
  );

  // Always listen to System preference
  useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY) {
        return;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = e.newValue || defaultTheme;
      setTheme(theme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, setTheme]);

  // Whenever theme or forcedTheme changes, apply it
  useEffect(() => {
    applyTheme(forcedTheme ?? theme);
  }, [applyTheme, forcedTheme, theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        forcedTheme,
        resolvedTheme: theme === "system" ? resolvedTheme : theme,
        themes: enableSystem ? [...themes, "system"] : themes,
        systemTheme: (enableSystem ? resolvedTheme : undefined) as
          | "light"
          | "dark"
          | undefined,
      }}
    >
      <ThemeScript
        {...{
          forcedTheme,
          disableTransitionOnChange,
          enableSystem,
          enableColorScheme,
          themes,
          defaultTheme,
          attribute,
          value,
          children,
          attrs,
          nonce,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
};

const ThemeScript = memo(
  ({
    forcedTheme,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    attrs,
    nonce,
  }: ThemeProviderProps & { attrs: string[]; defaultTheme: string }) => {
    const defaultSystem = defaultTheme === "system";

    // Code-golfing the amount of characters in the script
    const optimization = (() => {
      const removeClasses = `d.remove(${attrs
        .map((t: string) => `'${t}'`)
        .join(",")})`;

      return `var d=document.documentElement.classList;${removeClasses};`;
    })();

    const fallbackColorScheme = (() => {
      if (!enableColorScheme) {
        return "";
      }

      const fallback = colorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;

      if (fallback) {
        return `if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${defaultTheme}'`;
      } else {
        return `if(e==='light'||e==='dark')d.style.colorScheme=e`;
      }
    })();

    const updateDOM = (
      name: string,
      literal = false,
      setColorScheme = true,
    ) => {
      const resolvedName = value ? value[name] : name;
      const val = literal ? name + `|| ''` : `'${resolvedName}'`;
      let text = "";

      // MUCH faster to set colorScheme alongside HTML attribute/class
      // as it only incurs 1 style recalculation rather than 2
      // This can save over 250ms of work for pages with big DOM
      if (
        enableColorScheme &&
        setColorScheme &&
        !literal &&
        colorSchemes.includes(name)
      ) {
        text += `d.style.colorScheme = '${name}';`;
      }

      if (attribute === "class") {
        if (literal || resolvedName) {
          text += `d.add(${val})`;
        } else {
          text += `null`;
        }
      } else {
        if (resolvedName) {
          text += `d[s](n, ${val})`;
        }
      }

      return text;
    };

    const scriptSrc = (() => {
      if (forcedTheme) {
        return `!function(){${optimization}${updateDOM(forcedTheme)}}()`;
      }

      if (enableSystem) {
        return `!function(){try {${optimization}var e=localStorage.getItem('${THEME_STORAGE_KEY}');if("system"===e||(!e&&${defaultSystem})){var t="${MEDIA}",m=window.matchMedia(t);if(m.media!==t||m.matches){${updateDOM(
          "dark",
        )}}else{${updateDOM("light")}}}else if(e){${
          value ? `var x=${JSON.stringify(value)};` : ""
        }${updateDOM(value ? `x[e]` : "e", true)}}${
          !defaultSystem
            ? `else{` + updateDOM(defaultTheme, false, false) + "}"
            : ""
        }${fallbackColorScheme}}catch(e){}}()`;
      }

      return `!function(){try{${optimization}var e=localStorage.getItem("${THEME_STORAGE_KEY}");if(e){${
        value ? `var x=${JSON.stringify(value)};` : ""
      }${updateDOM(value ? `x[e]` : "e", true)}}else{${updateDOM(
        defaultTheme,
        false,
        false,
      )};}${fallbackColorScheme}}catch(t){}}();`;
    })();

    // We MUST use next/script's `beforeInteractive` strategy to avoid flashing on load.
    // However, it only accepts the `src` prop, not `dangerouslySetInnerHTML` or `children`
    // But our script cannot be external because it changes at runtime based on React props
    // so we trick next/script by passing `src` as a base64 JS script
    const encodedScript = `data:text/javascript;base64,${encodeBase64(
      scriptSrc,
    )}`;
    return (
      <NextScript
        id="next-theme-script"
        strategy="beforeInteractive"
        src={encodedScript}
        nonce={nonce}
      />
    );
  },
  // Never re-render this component
  () => true,
);

// Helpers
const getTheme = (key: string, fallback?: string) => {
  if (isServer) return undefined;
  let theme;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch (e) {
    // Unsupported
  }
  return theme || fallback;
};

const disableAnimation = () => {
  const d = document;
  const css = d.createElement("style");
  css.appendChild(
    d.createTextNode(
      `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
    ),
  );
  d.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(d.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      d.head.removeChild(css);
    }, 1);
  };
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  if (!e) e = window.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};

const encodeBase64 = (str: string) => {
  return isServer ? Buffer.from(str).toString("base64") : btoa(str);
};

export default ThemeProvider;
