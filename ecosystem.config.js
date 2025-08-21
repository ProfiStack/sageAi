module.exports = {
  apps: [
    {
      name: "fastapi-app",
      script: "uv",
      args: "run main.py --workers 2 --proxy-headers",
      cwd: "/home/ec2-user/sageAi",
      env: {
        ENVIRONMENT: "production",
      }
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

