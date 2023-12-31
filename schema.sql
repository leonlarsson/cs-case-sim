CREATE TABLE case_sim_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(255) NOT NULL,
    case_name VARCHAR(255) NOT NULL,
    case_image VARCHAR(600) NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_image VARCHAR(600) NOT NULL,
    rarity VARCHAR(255) NOT NULL,
    phase VARCHAR(50) DEFAULT NULL,
    unboxed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rarity ON case_sim_items (rarity);