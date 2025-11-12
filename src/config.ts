import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(userName: string) {
  const config = readConfig();
  config.currentUserName = userName.trim();
  writeConfig(config);
}

export function readConfig(): Config {
  return validateConfig(
    JSON.parse(fs.readFileSync(getConfigFilePath(), "utf-8"))
  );
}

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(config: Config): void {
  const rawConfig = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName,
  };
  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(getConfigFilePath(), data, { encoding: "utf-8" });
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName:
      typeof rawConfig.current_user_name === "string"
        ? rawConfig.current_user_name
        : "",
  };

  return config;
}
