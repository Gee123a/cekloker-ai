module.exports = {
  apps: [
    {
      name: 'cekloker-ai',
      script: 'node_modules/.bin/next',
      args: 'start -p 3080',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3080
      }
    }
  ]
};
