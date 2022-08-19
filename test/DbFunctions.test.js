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

    it("Should be able to add user on working days table", async () => {
        const dbFunction = DbFunctions(db)
        await dbFunction.addWaiter("Lukhanyo")

        // adding user to work for days mon-friday
        // each day is represented by the id from 1-7
        //  1 being monday - 7 being sunday
        await dbFunction.addWorkDay("Lukhanyo", [1,2,3,4,5])

        const days = await dbFunction.getDaysFor("Lukhanyo")

        assert.equal(5, await days.length)
    })

    it("Should be able to get weekdays stored in database", async () => {
        const dbFunction = DbFunctions(db)

        // there are 7 weekdays that are stored on the weekdays table4
        const weekdays = await dbFunction.getWeekdays()
        assert.equal(7, weekdays.length)
    })
})