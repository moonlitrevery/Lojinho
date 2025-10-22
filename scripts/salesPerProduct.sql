-- Complex SQL: JOIN + SUM

SELECT p.product_id, p.name, SUM(oi.quantity * oi.price_at_purchase) AS total_sales
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
GROUP BY p.product_id, p.name
ORDER BY total_sales DESC;