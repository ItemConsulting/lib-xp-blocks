module.exports = (ctx) => {
  const dev = ctx.env === "development";

  return {
    map: dev ? { inline: false } : false,
    plugins: {
      "postcss-import": {},
      ...(dev ? {} : { cssnano: {} }),
    },
  };
};
