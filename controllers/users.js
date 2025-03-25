const User=require("../models/user");


//1) for registering the user in the databasee--------------------------------------------
module.exports.registerUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);

        //login after signup
        req.login(registeredUser, (error) => {
            if (error) {
                return next(error);
            }
            req.flash("success", "Welcome to Wanderllust");
            return res.redirect("/listings");
        })
    }
    catch (error) {
        req.flash("error", error.message);
        res.redirect("/login");
    }
};


//2) for getting the login form--------------------------------------------
module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login");
};


//3) for login----------------------------------------------------------
module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome back to wnaderlust");

    let redirectUrl=res.locals.redirectUrl;
    if(!redirectUrl){
        return res.redirect("/listings");
    }
    res.redirect(res.locals.redirectUrl);
};


//4) for logout-----------------------------------------------------------
module.exports.logoutUser = (req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You have logged out");
        res.redirect("/listings");
    });
};