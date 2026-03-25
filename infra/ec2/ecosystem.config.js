module.exports = {
  apps: [
    {
      name: 'pandamarket',
      script: './dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
