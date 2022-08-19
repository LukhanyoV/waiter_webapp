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

    it("Should be able to add waiter", async () => {
        const dbFunction = DbFunctions(db)
        await dbFunction.addWaiter("Lukhanyo")
        await dbFunction.addWaiter("Emihle")

        assert.equal(true, await dbFunction.userExists("Lukhanyo"))

        assert.equal(false, await dbFunction.userExists("Zeenat"))
    })
})