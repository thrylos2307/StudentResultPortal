module.exports.checkUserLoggedIn = (req, res, next) => {
    //first logout as admin
    return req.user && req.user.isVoter ? next() : res.render('stage1');
}

module.exports.checkLoggedIn = (req, res, next) => {
    //first logout as admin
    return req.user ? next() : res.render('stage1');
}

module.exports.checkAdminLoggedIn = (req, res, next) => {
    //first logout as admin
    return req.user && !req.user.isVoter ? next() : res.render('stage1');
}

module.exports.stage2 = (req, res, next) => {
    console.log(req.session.uid );
    return req.session.uid ? next() : res.render('stage2');
}

module.exports.stage2_1 = (req, res, next) => {
    console.log(req.session.uid);
    return req.session.uid ? res.redirect('/home') : next();
}