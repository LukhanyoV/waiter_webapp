const assert = require("assert")
const pgp = require("pg-promise")({})
const DbFunctions = require("../db/DbFunctions")
const db = pgp({
    connectionString: "postgresql://test:test123@localhost:5432/test_db"
})

describe("Testing my Waiter App queries", () => {
    beforeEach(async () => {
        await db.none('TRUNCATE waiters, workingdays;')
    })

    it("Should work", async () => {
        assert.equal(1,1)
    })
})