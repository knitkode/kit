module.exports = (config) => {
  return {
    ...config,
    output: config.output.map((o) => ({
      ...o,
      preserveModules: true,
    })),
  };
};
