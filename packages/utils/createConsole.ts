type ConsoleMethod = "log" | "info" | "warn" | "error" | "debug";

// - enabled only when `process.env["NODE_ENV"] === "development"`
/**
 * A basic native `console` enhancement:
 * - optional _prefix_ to all messages
 * - `first` logging method which prints only the first message among equals (a kind of more basic throttling)
 * - `once` logging method which prints only once a message among equals
 *
 * @param prefix Optional, formatted as `[prefix] ` before your message, coloured in [gray](https://en.wikipedia.org/wiki/ANSI_escape_code#Colors)
 * @returns A `console` object (it does not inherit all native `console` methods)
 */
export let createConsole = (prefix?: string) => {
  /**
   * @param method `console.` method
   * @param message
   */
  const print = (
    method: ConsoleMethod,
    message: string,
    ...args: unknown[]
  ) => {
    // if (process.env["NODE_ENV"] === "development") {
    console[method](
      "\x1b[90m%s\x1b[0m" + message,
      prefix ? "[" + prefix + "] " : "",
      ...args,
    );
    // }
  };

  const createMethod = <T extends ConsoleMethod>(method: T) => {
    const standard = (message: string, ...args: unknown[]) =>
      print(method, message, ...args);

    // if (process.env["NODE_ENV"] === "development") {
    const messages = new Set();
    let lastMessage = "";

    standard.once = (message: string, ...args: unknown[]) => {
      if (!messages.has(message)) {
        messages.add(message);
        print(method, message, ...args);
      }
    };

    standard.first = (message: string, ...args: unknown[]) => {
      if (message !== lastMessage) {
        lastMessage = message;
        print(method, message, ...args);
      }
    };
    // } else {
    //   standard.once = (..._args: unknown[]) => void 0;
    //   standard.first = (..._args: unknown[]) => void 0;
    // }

    return standard;
  };

  const enhancedConsole = {} as {
    [Method in ConsoleMethod]: ReturnType<typeof createMethod<Method>>;
  };

  (["log", "info", "warn", "error", "debug"] as const).forEach((method) => {
    enhancedConsole[method] = createMethod(method);
  });

  return enhancedConsole;
};

export default createConsole;
