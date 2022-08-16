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
        const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        const color = (day) => {
            const count = days.filter(user=>user.workingday === day).length
            if(count === 0) return "none"
            if(count < 3) return "warning"
            if(count === 3) return "success"
            if(count > 3) return "danger"
        }
        res.render("days", {
            weekdays,
            helpers: {
                color
            }
        })
    }

    const viewDay = async (req, res) => {
        const days = await dbFunctions.getDays()
        const sameday = (day) => {
            const results = days.filter(user=>user.workingday === day).map(user=>user.username)
            return results.length !== 0 ? results : ""
        }
        let {day} = req.params
        day = day[0].toUpperCase()+day.slice(1).toLowerCase()
        res.render("viewday", {
            day,
            waiters: sameday(day.toLowerCase())
        })
    }

    const getWaiter = async (req, res) => {
        const {username} = req.params
        const days = await dbFunctions.getDaysFor(username)
        res.render("waiters", {
            username,
            weekdays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
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

    return {
        indexGet,
        indexPost,
        getDays,
        getWaiter,
        postWaiter,
        clearWaiters,
        viewDay
    }
}

module.exports = Routes
