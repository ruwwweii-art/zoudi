/**
 * PM2 生产进程配置
 * 服务器上运行：pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: "zoudi",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/zoudi",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
