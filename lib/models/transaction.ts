export const createOrSyncTxnTable = () => {
  return `
  CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_account VARCHAR(10) NOT NULL,
    to_account VARCHAR(10) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_account) REFERENCES accounts(account_number),
    FOREIGN KEY (to_account) REFERENCES accounts(account_number),
    INDEX idx_from_account (from_account),
    INDEX idx_to_account (to_account) )`;
};
