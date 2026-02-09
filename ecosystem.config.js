module.exports = {
  apps: [
    {
  name: "fastapi-app",
  script: "uv",
  args: [
    "run", "-m", "gunicorn",
    "main:app",
    "-k", "uvicorn.workers.UvicornWorker",
    "--bind", "0.0.0.0:8000",
    "--workers", "4",
    "--threads", "2",
    "--timeout", "60",
    "--keep-alive", "5"
  ],
  cwd: "/home/ec2-user/sageAi",
  env: { ENVIRONMENT: "production" }
},
    {
      name: "nextjs-frontend",
      script: "pnpm",
      args: "run start",
      cwd: "/home/ec2-user/sageAi/frontend",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};

