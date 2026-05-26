// Import required modules
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({
  path: path.join(__dirname, '..', '.env'),
});

// Define the configuration interface
interface Config {
  // Database settings
  db: {
    uri: string;
    username: string;
    password: string;
    database: string;
  };

  // Server settings
  server: {
    port: number;
    host: string;
  };

  // API settings
  api: {
    prefix: string;
  };

  // JWT settings
  jwt: {
    secret: string;
    expires: string;
  };
}

// Define the configuration
const config: Config = {
  // Database settings
  db: {
    uri: process.env.DB_URI as string,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
  },

  // Server settings
  server: {
    port: parseInt(process.env.SERVER_PORT as string, 10),
    host: process.env.SERVER_HOST as string,
  },

  // API settings
  api: {
    prefix: process.env.API_PREFIX as string,
  },

  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expires: process.env.JWT_EXPIRES as string,
  },
};

// Export the configuration
export default config;

// Define a function to validate the configuration
function validateConfig(config: Config): void {
  // Check if all required environment variables are set
  if (
    !config.db.uri ||
    !config.db.username ||
    !config.db.password ||
    !config.db.database ||
    !config.server.port ||
    !config.server.host ||
    !config.api.prefix ||
    !config.jwt.secret ||
    !config.jwt.expires
  ) {
    throw new Error('Invalid configuration');
  }

  // Check if the port is a valid number
  if (isNaN(config.server.port)) {
    throw new Error('Invalid port number');
  }
}

// Validate the configuration
validateConfig(config);

// Define a function to get the configuration
function getConfig(): Config {
  return config;
}

// Export the getConfig function
export { getConfig };