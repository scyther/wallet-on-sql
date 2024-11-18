CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  account_number VARCHAR(10) UNIQUE NOT NULL,
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_account_number (account_number)
);

CREATE TABLE transactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  from_account VARCHAR(10) NOT NULL,
  to_account VARCHAR(10) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_account) REFERENCES accounts(account_number),
  FOREIGN KEY (to_account) REFERENCES accounts(account_number),
  INDEX idx_from_account (from_account),
  INDEX idx_to_account (to_account)
);