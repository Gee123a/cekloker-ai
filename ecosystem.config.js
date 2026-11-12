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
        PORT: 3080,
        SMTP_HOST: 'mailserver.purelymail.com',
        SMTP_PORT: '587',
        SMTP_USER: 'cekloker@uccca.site',
        SMTP_PASS: 'passwordceklokerini@@',
        GEMINI_MODEL: 'gemini-3.1-flash-lite'
      }
    }
  ]
};
