export const createOrSyncLoansTable = () => {
  return `
  CREATE TABLE IF NOT EXISTS loans ( 
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_number VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  tenure INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )`;
};
