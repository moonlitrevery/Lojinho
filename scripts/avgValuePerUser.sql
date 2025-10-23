-- Complex SQL: JOIN + AVG + subquery

SELECT u.user_id, u.name, AVG(o.total) AS avg_order_value FROM (
    SELECT o.order_id, o.user_id, SUM(oi.quantity * oi.price_at_purchase) AS total
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    GROUP BY o.order_id, o.user_id
) o JOIN users u ON u.user_id = o.user_id
GROUP BY u.user_id, u.name;