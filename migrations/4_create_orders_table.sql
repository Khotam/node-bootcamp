CREATE TYPE order_status as ENUM ('new', 'delivering', 'finished');

CREATE TABLE orders (
    id uuid PRIMARY KEY,
    status order_status DEFAULT 'new',
    assigned_to uuid REFERENCES users (id) DEFAULT null,
    customer_id uuid NOT NULL REFERENCES users (id)
);

CREATE TABLE order_products (
    order_id uuid REFERENCES orders (id),
    product_id uuid REFERENCES products (id)
);

-- products
-- 1 - iphone
-- 2 - samsung
-- 3 - redmi

-- orders
-- 1,new,null - 1,2 - iphone, samsung
-- 2 - 2,3 - samsung, redmi

-- 1,1
-- 1,2
-- 2,2
-- 2,3
-- 2,4
-- 2,5