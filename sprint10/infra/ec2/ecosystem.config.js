module.exports = {
  apps: [{
    name: "pandamarket",
    script: "./build/main.js",
    env: {
      NODE_ENV: "production",
    }
  }]
};
