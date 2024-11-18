export const createOrSyncAccountTable = () => {
  return `CREATE TABLE IF NOT EXISTS accounts (
       id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(10) UNIQUE NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_account_number (account_number)
    )
  `;
};
