DROP TABLE IF EXISTS waiters, weekdays, workingdays;

CREATE TABLE IF NOT EXISTS waiters (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS weekdays (
    id SERIAL PRIMARY KEY,
    week_day VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS workingdays (
    id SERIAL PRIMARY KEY,
    waiter_id INTEGER NOT NULL,
    workingday INTEGER NOT NULL,
    FOREIGN KEY(waiter_id) REFERENCES waiters(id),
    FOREIGN KEY(workingday) REFERENCES weekdays(id)
);

-- PREPOPULATE weekdays table
INSERT INTO weekdays (week_day) 
VALUES ('monday'), ('tuesday'), ('wednesday'), 
('thursday'), ('friday'), ('saturday'), ('sunday');
