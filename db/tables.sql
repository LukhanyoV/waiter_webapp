CREATE TABLE IF NOT EXISTS waiters (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS workingdays (
    id SERIAL PRIMARY KEY,
    waiter_id INTEGER NOT NULL,
    workingday VARCHAR(10) NOT NULL,
    FOREIGN KEY(waiter_id) REFERENCES waiters(id)
);

-- INSERT INTO waiters (username) VALUES ($1);
-- INSERT INTO workingdays (waiter_id, workingday) VALUES((SELECT id FROM waiters WHERE username=$1 LIMIT 1), $2)
-- SELECT waiters.username, workingdays.workingday FROM waiters INNER JOIN workingdays ON waiters.id = workingdays.waiter_id;
-- SELECT waiters.username, workingdays.workingday FROM waiters INNER JOIN workingdays ON waiters.id = workingdays.waiter_id WHERE username = $1;