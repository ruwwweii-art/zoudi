# 走地

基于 Next.js 16 的本地路线内容后台项目，当前默认配置为：

- AI: 阿里云百炼 DashScope OpenAI 兼容接口
- 模型: `qwen3-max-2026-01-23`
- 页面: 默认使用假数据演示模式
- 数据库: 需要真实数据时再接 MySQL

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 准备 `.env`

项目已自带 `.env.example` 模板。只想跑演示页面时，最少先填写这些值：

```env
DEMO_MODE="true"
DATABASE_URL=""
DASHSCOPE_API_KEY="your-dashscope-api-key"
DASHSCOPE_BASE_URL="https://coding.dashscope.aliyuncs.com/v1"
AI_MODEL="qwen3-max-2026-01-23"
JWT_SECRET="your-jwt-secret-at-least-32-chars-long"
AUTH_SECRET="your-auth-secret-generated-by-openssl"
```

3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看页面。

## 如果之后要切回真实数据库

把 `.env` 改成下面这样：

```env
DEMO_MODE="false"
DATABASE_URL="mysql://root:your_mysql_password@127.0.0.1:3306/zoudi"
```

然后执行：

```bash
npx prisma migrate dev --name init
```
