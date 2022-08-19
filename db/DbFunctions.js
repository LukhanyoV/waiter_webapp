const DbFunctions = (db) => {
    // insert new username to table waiters
    const addWaiter = async (waiter) => {
        const results = await userExists(waiter)
        if(results === false){
            await db.none('INSERT INTO waiters (username) VALUES ($1);', [waiter])
        }
    }

    // check if user already in waiters table
    // returns true if user exist
    // return false if user does not exist
    const userExists = async (waiter) => {
        const results = await db.oneOrNone('SELECT username FROM waiters WHERE username = $1;', [waiter])
        return results !== null
    }

    // add user availability for that day
    const addWorkDay = async (waiter, days) => {
        let waiter_id = await db.one('SELECT id FROM waiters WHERE username=$1 LIMIT 1', [waiter])
        waiter_id = waiter_id.id

        // delete the old working days from the user and accept the incoming one as update
        await db.none('DELETE FROM workingdays WHERE waiter_id = $1', [waiter_id])

        if(typeof days === "object"){
            for(let day of days){
                await db.none('INSERT INTO workingdays (waiter_id, workingday) VALUES($1, $2)', [waiter_id, day])
            }
        } else if(typeof days === "string"){
            await db.none('INSERT INTO workingdays (waiter_id, workingday) VALUES($1, $2)', [waiter_id, days])
        }
    }

    // get available days for each user
    const getDaysFor = async (username) => {
        const results = await db.manyOrNone('SELECT waiters.username, workingdays.workingday FROM waiters INNER JOIN workingdays ON waiters.id = workingdays.waiter_id WHERE username = $1;', [username])
        return results.map(row => row.workingday)
    }

    // get all available days for every user
    const getDays = async () => {
        const results = await db.manyOrNone('SELECT waiters.username, workingdays.workingday FROM waiters INNER JOIN workingdays ON waiters.id = workingdays.waiter_id;')
        return results
    }

    // get waiters for specific day
    const waitersFor = async (day) => {
        const results = db.manyOrNone('SELECT waiters.username FROM waiters INNER JOIN workingdays ON waiters.id = workingdays.waiter_id INNER JOIN weekdays ON workingdays.workingday = weekdays.id WHERE weekdays.week_day = $1', [day])
        return results
    }

    // get all the weekdays
    const getWeekdays = async () => {
        const results = await db.many('SELECT * FROM weekdays')
        return results
    }

    // count number of people for that day
    const counterDay = async (day) => {
        const results = await db.one('SELECT count(*) FROM workingdays WHERE workingday = $1', [day])
        return results.count
    }

    // clear waiters for a new week
    const clearWaiters = async () => {
        await db.none('TRUNCATE workingdays')
    }

    // clear waiters for specific day
    const clearDay = async (day) => {
        const id = await db.one('SELECT id FROM weekdays WHERE week_day = $1', [day.toLowerCase()]) 
        await db.none('DELETE FROM workingdays WHERE workingday = $1', [id.id])
    }

    return {
        addWaiter,
        addWorkDay,
        getDaysFor,
        getDays,
        counterDay,
        clearWaiters,
        getWeekdays,
        waitersFor,
        clearDay
    }
}

module.exports = DbFunctions