-- 1. USERS
CREATE TABLE USERS (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    is_vip BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ORGANIZATIONS
CREATE TABLE ORGANIZATIONS (
    org_id INT PRIMARY KEY AUTO_INCREMENT,
    org_name VARCHAR(256) NOT NULL,
    address VARCHAR(256),
    email VARCHAR(256) UNIQUE NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE
);

-- 3. EVENTS
CREATE TABLE EVENTS (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    org_id INT NOT NULL,
    event_name VARCHAR(256) NOT NULL,
    event_date DATETIME NOT NULL,
    location VARCHAR(256) NOT NULL,
    max_attendees INT,
    ticket_price DECIMAL(10,2),
    event_status VARCHAR(50) DEFAULT 'upcoming',
    is_sponsored BOOLEAN DEFAULT FALSE,
    sponsor_name VARCHAR(256),
    vip_access_time DATETIME,
    general_access_time DATETIME,
    FOREIGN KEY (org_id) REFERENCES ORGANIZATIONS(org_id)
);

-- 4. TICKETS  (ticket + attendance combined)
CREATE TABLE TICKETS (
    ticket_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    ticket_status VARCHAR(50) DEFAULT 'active',
    qr_code VARCHAR(500),
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_in_time DATETIME,
    purchase_source VARCHAR(50) DEFAULT 'direct',
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    UNIQUE(event_id, user_id)   -- One ticket per user per event
);

-- 5. PAYMENTS (Simplified: removed ticket_id)
CREATE TABLE PAYMENTS (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'completed',
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- 6. CHAT HISTORY
CREATE TABLE CHAT_HISTORY (
    chat_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    recommended_event_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (recommended_event_id) REFERENCES EVENTS(event_id)
);

-- 7. ADVERTISEMENTS
CREATE TABLE ADVERTISEMENTS (
    ad_id INT PRIMARY KEY AUTO_INCREMENT,
    advertiser_name VARCHAR(256) NOT NULL,
    ad_type VARCHAR(50) DEFAULT 'banner',
    event_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id)
);