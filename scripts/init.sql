DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- products table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INT DEFAULT 0 CHECK (stock >= 0),
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
        ON DELETE SET NULL
);

-- orders status table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending','paid','shipped','delivered','cancelled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- ordered items table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10,2) NOT NULL CHECK (price_at_purchase >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
        ON DELETE CASCADE
);

-- tags table
CREATE TABLE tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(100) NOT NULL UNIQUE
);

-- tags <-> products table
CREATE TABLE product_tags (
    product_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

-- seed to populate the tables in a synthetic/simple way.

DELIMITER $$

DROP PROCEDURE IF EXISTS populate_seed$$
CREATE PROCEDURE populate_seed()
BEGIN
    DECLARE i INT DEFAULT 1;

    WHILE i <= 100 DO
        -- users
        INSERT INTO users (name, email, password_hash)
        VALUES (
            CONCAT('User ', i),
            CONCAT('user', i, '@gmail.com'),
            CONCAT('$2b$12$seedhash', LPAD(i,3,'0'))
        );

        -- categories
        INSERT INTO categories (category_name, description)
        VALUES (
            CONCAT('Category ', i),
            CONCAT('Category description ', i)
        );

        -- products
        -- price = i * 3.50, stock between 1 e 100, category_id its going to be the same i (because we created 100 categories)
        INSERT INTO products (name, description, price, stock, category_id)
        VALUES (
            CONCAT('Product ', i),
            CONCAT('Product description ', i),
            ROUND(i * 3.50, 2),
            (i % 100) + 1,
            i
        );

        -- orders
        -- assign status by cycling through the enum values
        INSERT INTO orders (user_id, status)
        VALUES (
            i,
            ELT((i % 5) + 1, 'pending', 'paid', 'shipped', 'delivered', 'cancelled')
        );

        -- tags
        INSERT INTO tags (tag_name)
        VALUES (
            CONCAT('tag-', i)
        );

        -- product_tags (associate product i to tag i)
        INSERT INTO product_tags (product_id, tag_id)
        VALUES (i, i);

        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- calls the procedure that populates the tables
CALL populate_seed();

-- generates 100 order_items, each linked to order i -> product i
-- quantity = (product_id % 4) + 1 (values from 1 to 4)
-- price_at_purchase uses the product's current price
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
SELECT o.order_id, p.product_id, (p.product_id % 4) + 1 AS quantity, p.price
FROM orders o
JOIN products p ON p.product_id = o.order_id;
