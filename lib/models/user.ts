export const createOrSyncUserTable = () => {
  return `
  CREATE TABLE IF NOT EXISTS users (
       id VARCHAR(255) PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       name VARCHAR(255),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )`;
};
