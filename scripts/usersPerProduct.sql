-- Complex SQL: EXISTS / subquery

SELECT u.user_id, u.name
FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.user_id = u.user_id AND oi.product_id = 1
);