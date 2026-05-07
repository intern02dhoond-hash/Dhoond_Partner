-- ============================================================
-- Dhoond Partner App — Database Schema
-- Auth     : Firebase (firebase_uid is the identity anchor)
-- Features : Partner Profile, On/Off Duty, Order Broadcast,
--            Accept Order, Arrival OTP, Completion OTP
-- ============================================================


-- ============================================================
-- 1. PARTNERS
--    One row per partner.
--    Firebase handles login/signup — we only store firebase_uid.
--    Duty status (on/off) is tracked here.
-- ============================================================

CREATE TABLE IF NOT EXISTS partners (
    id              SERIAL PRIMARY KEY,
    public_id       UUID UNIQUE DEFAULT gen_random_uuid(), -- Secure public ID for APIs

    -- Firebase auth anchor (from Firebase ID token)
    firebase_uid    VARCHAR(128) UNIQUE NOT NULL,

    -- Basic profile
    full_name       VARCHAR(150) NOT NULL,
    phone           VARCHAR(20)  UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE,
    profile_photo   TEXT,                          -- URL (Firebase Storage / S3)

    -- Service info
    service_type    VARCHAR(100) NOT NULL,          -- e.g. 'Plumber', 'Electrician'

    -- On / Off duty toggle
    -- 'online'  → partner is ready to receive broadcast orders
    -- 'offline' → partner will not receive any broadcasts
    duty_status     VARCHAR(20)  NOT NULL DEFAULT 'offline'
                        CHECK (duty_status IN ('online', 'offline')),

    -- Last known location (updated when partner goes online or moves)
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),

    is_active       BOOLEAN NOT NULL DEFAULT TRUE,  -- admin can deactivate
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 2. ORDERS
--    Created by the customer side (or admin).
--    partner_id is NULL until a partner accepts.
--    status lifecycle:
--      pending → broadcasted → accepted → partner_arrived
--              → in_progress → completed | cancelled
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
    id                  SERIAL PRIMARY KEY,
    public_id           UUID UNIQUE DEFAULT gen_random_uuid(), -- Secure public ID for APIs

    -- Customer identity (Firebase UID from the customer app)
    customer_firebase_uid VARCHAR(128) NOT NULL,
    customer_name         VARCHAR(150),
    customer_phone        VARCHAR(20),

    -- Service details
    service_type        VARCHAR(100) NOT NULL,
    description         TEXT,

    -- Service location
    service_address     TEXT NOT NULL,
    latitude            DECIMAL(10, 8) NOT NULL,
    longitude           DECIMAL(11, 8) NOT NULL,

    -- Assigned partner (null until accepted)
    partner_id          INT REFERENCES partners(id) ON DELETE SET NULL,

    -- Order lifecycle status
    status              VARCHAR(30) NOT NULL DEFAULT 'pending'
                            CHECK (status IN (
                                'pending',        -- order just created, not yet broadcast
                                'broadcasted',    -- sent to nearby partners
                                'accepted',       -- a partner accepted it
                                'partner_arrived',-- partner has arrived (arrival OTP verified)
                                'in_progress',    -- work started
                                'completed',      -- completion OTP verified, job done
                                'cancelled'       -- cancelled by customer or system
                            )),

    -- Financials
    estimated_amount    DECIMAL(10, 2),
    final_amount        DECIMAL(10, 2),

    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 3. BROADCASTS
--    When an order is created, it is broadcast to all nearby
--    online partners within a radius.
--    Each partner who receives it has a row in broadcast_receivers.
-- ============================================================

CREATE TABLE IF NOT EXISTS broadcasts (
    id              SERIAL PRIMARY KEY,
    order_id        INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    radius_km       DECIMAL(5, 2) NOT NULL DEFAULT 5.0,  -- search radius used

    -- 'active'    → still waiting for a partner to accept
    -- 'fulfilled' → a partner accepted, broadcast closed
    -- 'expired'   → timed out with no acceptance
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'fulfilled', 'expired')),

    expires_at      TIMESTAMP NOT NULL,                   -- auto-expire if no acceptance
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Which partners received this broadcast and how they responded
CREATE TABLE IF NOT EXISTS broadcast_receivers (
    id              SERIAL PRIMARY KEY,
    broadcast_id    INT NOT NULL REFERENCES broadcasts(id)  ON DELETE CASCADE,
    partner_id      INT NOT NULL REFERENCES partners(id)    ON DELETE CASCADE,

    -- 'sent'     → notification sent, no response yet
    -- 'accepted' → partner accepted
    -- 'rejected' → partner rejected / ignored
    status          VARCHAR(20) NOT NULL DEFAULT 'sent'
                        CHECK (status IN ('sent', 'accepted', 'rejected')),

    responded_at    TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (broadcast_id, partner_id)                       -- one row per partner per broadcast
);


-- ============================================================
-- 4. ORDER OTPS
--    Two OTP events per order:
--      1. arrival_otp   — partner shows this to customer on arrival
--                         customer enters it → order moves to 'partner_arrived'
--      2. completion_otp — generated at end of work
--                          customer enters it → order moves to 'completed'
--
--    Both OTPs are stored in this single table distinguished by `otp_type`.
-- ============================================================

CREATE TABLE IF NOT EXISTS order_otps (
    id              SERIAL PRIMARY KEY,
    order_id        INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    otp_type        VARCHAR(20) NOT NULL
                        CHECK (otp_type IN ('arrival', 'completion')),

    otp_code        VARCHAR(6) NOT NULL,
    is_used         BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      TIMESTAMP NOT NULL,

    verified_at     TIMESTAMP,                             -- when it was successfully verified
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Only one active (unused) OTP per order per type at a time
    UNIQUE (order_id, otp_type)
);


-- ============================================================
-- 5. PARTNER DUTY LOGS  (optional but recommended)
--    Tracks every time a partner goes online / offline.
--    Useful for analytics, disputes, and pay calculations.
-- ============================================================

CREATE TABLE IF NOT EXISTS partner_duty_logs (
    id              SERIAL PRIMARY KEY,
    partner_id      INT NOT NULL REFERENCES partners(id) ON DELETE CASCADE,

    event           VARCHAR(10) NOT NULL
                        CHECK (event IN ('online', 'offline')),

    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),

    logged_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
