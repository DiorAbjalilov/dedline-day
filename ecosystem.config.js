module.exports = {
  apps: [
    {
      name: "deadline-reminder-bot",
      script: "yarn run start:dev",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
