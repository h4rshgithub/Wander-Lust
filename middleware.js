module.exports.isLoggedIn = (req ,res , next) => {
    if(!req.isAuthenticated()){
        req.flash("error","You are not logged in , Please login to access listing");
        return res.redirect("/login");
    }
    next();
}