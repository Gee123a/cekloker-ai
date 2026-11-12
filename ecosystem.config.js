module.exports = {
  apps: [
    {
      name: 'cekloker-ai',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3080',
      cwd: '/home/uccca-cekloker/htdocs/cekloker.uccca.site',
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
