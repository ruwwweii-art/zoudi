#!/bin/bash
# ============================================
# 走地 部署脚本（从本地推送到服务器）
# 使用方法：chmod +x deploy.sh && ./deploy.sh
# ============================================

set -e

# ── 配置区（修改这里）──────────────────────
SERVER_USER="root"             # SSH 用户名（腾讯云通常是 ubuntu 或 root）
SERVER_IP="111.229.165.138"
SSH_KEY=""                     # 密钥路径，如 ~/.ssh/lighthouse.pem；密码登录留空
REMOTE_DIR="/var/www/zoudi"
# ──────────────────────────────────────────

SSH_CMD="ssh"
RSYNC_CMD="rsync"
if [ -n "$SSH_KEY" ]; then
  SSH_CMD="ssh -i $SSH_KEY"
  RSYNC_CMD="rsync -e 'ssh -i $SSH_KEY'"
fi

echo "🚀 开始部署 走地 到 $SERVER_IP ..."

# 1. 同步代码（排除 node_modules / .next / .env 等）
echo "📦 同步代码..."
rsync -avz --delete \
  ${SSH_KEY:+-e "ssh -i $SSH_KEY"} \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.env' \
  --exclude='.env.local' \
  --exclude='.env.production' \
  --exclude='deploy.sh' \
  --exclude='*.log' \
  ./ "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

# 2. 上传生产环境变量（单独传，保留服务器上的版本）
echo "🔐 上传环境变量..."
if [ -f ".env.production" ]; then
  scp ${SSH_KEY:+-i "$SSH_KEY"} .env.production "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/.env"
fi

# 3. 在服务器上执行安装 + 构建 + 重启
echo "🔧 服务器端：安装依赖 + 构建..."
$SSH_CMD "$SERVER_USER@$SERVER_IP" << 'REMOTE'
  set -e
  cd /var/www/zoudi

  # 安装依赖
  npm install --production=false

  # 构建
  npm run build

  # 用 PM2 启动/重启
  if pm2 list | grep -q "zoudi"; then
    echo "♻️  重启 PM2 进程..."
    pm2 reload zoudi
  else
    echo "🆕 首次启动 PM2 进程..."
    pm2 start ecosystem.config.cjs
    pm2 save
  fi

  echo "✅ 部署完成！"
REMOTE

echo ""
echo "✅ 全部完成！访问 http://$SERVER_IP 查看效果"
