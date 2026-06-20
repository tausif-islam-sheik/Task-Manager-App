import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  APP_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requireEnvVariable = ["PORT", "APP_URL"];

  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(
        `Environment variable ${variable} is required but not set in .env file.`,
      );
    }
  });

  return {
    PORT: process.env.PORT as string,
    APP_URL: process.env.APP_URL as string,
  };
};

export const env = loadEnvVariables();
