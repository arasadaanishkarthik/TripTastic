-- =============================================================================
-- TripTastic — MySQL Database Schema
-- Run this file once to initialize the database and all tables.
-- =============================================================================

-- Create database if it does not exist
CREATE DATABASE IF NOT EXISTS triptastic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE triptastic;

-- =============================================================================
-- USERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120)    NOT NULL,
  email         VARCHAR(255)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  avatar_url    VARCHAR(500)    DEFAULT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- DESTINATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS destinations (
  id          VARCHAR(60)     NOT NULL,        -- slug-style: 'ladakh', 'goa', 'tokyo'
  name        VARCHAR(120)    NOT NULL,
  city        VARCHAR(120)    DEFAULT NULL,
  country     VARCHAR(120)    NOT NULL,
  state       VARCHAR(120)    DEFAULT NULL,
  region      VARCHAR(120)    DEFAULT NULL,
  category    VARCHAR(60)     DEFAULT NULL,    -- mountains, beaches, culture, city, nature, adventure
  description TEXT            DEFAULT NULL,
  latitude    DECIMAL(9,6)    DEFAULT NULL,
  longitude   DECIMAL(9,6)    DEFAULT NULL,
  image_url   VARCHAR(500)    DEFAULT NULL,
  travel_type ENUM('national','international') NOT NULL DEFAULT 'national',
  popular     TINYINT(1)      NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_dest_travel_type (travel_type),
  INDEX idx_dest_category    (category),
  INDEX idx_dest_country     (country),
  FULLTEXT idx_dest_search   (name, city, state, country, region, description, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TRIPS
-- =============================================================================
CREATE TABLE IF NOT EXISTS trips (
  id               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id          INT UNSIGNED    DEFAULT NULL,   -- NULL = anonymous/draft
  destination_id   VARCHAR(60)     NOT NULL,
  title            VARCHAR(255)    DEFAULT NULL,
  start_date       DATE            DEFAULT NULL,
  end_date         DATE            DEFAULT NULL,
  travelers        INT UNSIGNED    NOT NULL DEFAULT 1,
  budget_per_person DECIMAL(12,2)  DEFAULT NULL,
  total_budget     DECIMAL(12,2)   DEFAULT NULL,
  status           ENUM('draft','planned','confirmed','completed','cancelled')
                   NOT NULL DEFAULT 'draft',
  mode             ENUM('national','international') NOT NULL DEFAULT 'national',
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_trips_user       (user_id),
  INDEX idx_trips_destination(destination_id),
  INDEX idx_trips_status     (status),
  CONSTRAINT fk_trips_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_trips_destination
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TRIP MEMBERS
-- =============================================================================
CREATE TABLE IF NOT EXISTS trip_members (
  id         INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  trip_id    INT UNSIGNED   NOT NULL,
  user_id    INT UNSIGNED   DEFAULT NULL,
  name       VARCHAR(120)   DEFAULT NULL,   -- for non-registered members
  role       ENUM('organizer','member','viewer') NOT NULL DEFAULT 'member',
  created_at DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_trip_members_trip (trip_id),
  INDEX idx_trip_members_user (user_id),
  CONSTRAINT fk_members_trip
    FOREIGN KEY (trip_id) REFERENCES trips(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_members_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TRIP PREFERENCES
-- =============================================================================
CREATE TABLE IF NOT EXISTS trip_preferences (
  id                   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  trip_id              INT UNSIGNED NOT NULL,
  travel_style         VARCHAR(60)  DEFAULT NULL,   -- backpacker, luxury, family, etc.
  interests            JSON         DEFAULT NULL,   -- ["adventure","nature","food"]
  accommodation_type   VARCHAR(60)  DEFAULT NULL,   -- hotel, hostel, resort, camping
  food_preferences     JSON         DEFAULT NULL,   -- ["vegetarian","seafood"]
  transport_preference VARCHAR(60)  DEFAULT NULL,   -- flight, train, road, mixed
  created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_trip_prefs (trip_id),
  CONSTRAINT fk_prefs_trip
    FOREIGN KEY (trip_id) REFERENCES trips(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- ITINERARY (future)
-- =============================================================================
CREATE TABLE IF NOT EXISTS itinerary_days (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  trip_id     INT UNSIGNED  NOT NULL,
  day_number  TINYINT       NOT NULL,
  date        DATE          DEFAULT NULL,
  title       VARCHAR(255)  DEFAULT NULL,
  summary     TEXT          DEFAULT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_itin_trip (trip_id),
  CONSTRAINT fk_itin_trip
    FOREIGN KEY (trip_id) REFERENCES trips(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;