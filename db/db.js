const pgp = require("pg-promise")({})
const localDB = "postgresql://postgres:nimda@localhost:5432/waiterapp"
const connectionString = process.env.DATABASE_URL || localDB
const config = {
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
}
const db = pgp(config)
module.exports = db