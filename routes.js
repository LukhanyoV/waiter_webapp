const Routes = dbFunctions => {
    const indexGet = async (req, res) => {
        
        res.render("index")
    }

    const indexPost = async (req, res) => {
        let {username} = req.body
        username = username.trim()
        if(username === ""){
            req.flash("danger", "Please enter your name!")
            res.redirect("back")
        } else if(!/^[aA-zZ]+$/.test(username)){
            req.flash("danger", "Username has to be only letters!")
            res.redirect("back")
        } else {
            username = username[0].toUpperCase()+username.slice(1).toLowerCase()
            await dbFunctions.addWaiter(username)
            res.redirect(`/waiters/${username}`)
        }
    }

    const getDays = async (req, res) => {
        const days = await dbFunctions.getDays()
        const weekdays = await dbFunctions.getWeekdays()
        const color = (day) => {
            const count = days.filter(user=>user.workingday === day).length
            if(count === 0) return "none"
            if(count < 3) return "warning-bg"
            if(count === 3) return "success-bg"
            if(count > 3) return "danger-bg"
        }
        res.render("days", {
            weekdays,
            helpers: {
                color
            }
        })
    }

    const viewDay = async (req, res) => {
        let {day} = req.params
        day = day[0].toUpperCase()+day.slice(1).toLowerCase()
        const waiters = await dbFunctions.waitersFor(day.toLowerCase())
        res.render("viewday", {
            day,
            waiters
        })
    }

    const getWaiter = async (req, res) => {
        const {username} = req.params
        const weekdays = await dbFunctions.getWeekdays()
        const days = await dbFunctions.getDaysFor(username)
        res.render("waiters", {
            username,
            weekdays,
            helpers: {
                checkday: day => {
                    if(days.includes(day)){
                        return "checked"
                    }
                },
                upper: day => {
                    return day[0].toUpperCase()+day.slice(1).toLowerCase()
                }
            }
        })
    }

    const postWaiter = async (req, res) => {
        const {username} = req.body
        const {weekdays} = req.body
        await dbFunctions.addWorkDay(username, weekdays)
        req.flash("success", "Working days have been updated!")
        res.redirect("back")
    }

    const clearWaiters = async (req, res) => {
        await dbFunctions.clearWaiters()
        req.flash("success", "Waiters have been cleared for this week!")
        res.redirect("back")
    }

    const clearDay = async (req, res) => {
        const {day} = req.params
        await dbFunctions.clearDay(day)
        req.flash("success", "Waiters have been cleared for this day!")
        res.redirect("back")
    }

    const removeUser = async (req, res) => {
        const {day} = req.params
        const {user} = req.body
        await dbFunctions.removeUser(day, user)
        req.flash("success", `${user} has been removed for ${day}!`)
        res.redirect("back")
    }

    return {
        indexGet,
        indexPost,
        getDays,
        getWaiter,
        postWaiter,
        clearWaiters,
        viewDay,
        clearDay,
        removeUser
    }
}

module.exports = Routes
