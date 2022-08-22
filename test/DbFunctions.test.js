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

    it("Should be able to get waiters for specific working day", async () => {
        const dbFunction = DbFunctions(db)
        await dbFunction.addWaiter("Lukhanyo")
        await dbFunction.addWaiter("Emihle")

        await dbFunction.addWorkDay("Lukhanyo", [1,2,3,4,5])
        await dbFunction.addWorkDay("Emihle", "1")

        // get waiters for monday
        const waitersMonday = await dbFunction.waitersFor("monday")
        assert.equal(2, waitersMonday.length)


        // get waiters for friday
        const waitersFriday = await dbFunction.waitersFor("friday")
        assert.equal(1, waitersFriday.length)

        // get waiters for sunday
        const waiterSunday = await dbFunction.waitersFor("sunday")
        assert.equal(0, waiterSunday.length)
    })

    it("Should be able to clear waiters from a specified day", async () => {
        const dbFunction = DbFunctions(db)
        await dbFunction.addWaiter("Lukhanyo")
        await dbFunction.addWaiter("Emihle")

        await dbFunction.addWorkDay("Lukhanyo", [1,2,3,4,5])
        await dbFunction.addWorkDay("Emihle", "1")

        // test to check if we have waiters on monday
        let waitersMonday = await dbFunction.waitersFor("monday")
        assert.equal(2, waitersMonday.length)

        // clear waiters for monday
        await dbFunction.clearDay("monday")

        waitersMonday = await dbFunction.waitersFor("monday")
        assert.equal(0, waitersMonday.length)
    })
    
    it("Should be able to clear individual waiter from a specified day", async () => {
        const dbFunction = DbFunctions(db)
        await dbFunction.addWaiter("Lukhanyo")
        await dbFunction.addWaiter("Emihle")
        await dbFunction.addWaiter("Vakele")

        await dbFunction.addWorkDay("Lukhanyo", [1,2,3,4,5])
        await dbFunction.addWorkDay("Emihle", "1")
        await dbFunction.addWorkDay("Vakele", [1,3,4])

        // test to check how many waiter we have on monday
        let waitersMonday = await dbFunction.waitersFor("monday")
        assert.equal(3, waitersMonday.length)

        // remove waiter Vakele from monday
        await dbFunction.removeUser('monday', 'Vakele')

        // check how many user remaining after
        waitersMonday = await dbFunction.waitersFor("monday")
        // returns 2 since we had three and removed one
        assert.equal(2, waitersMonday.length)
    })
})