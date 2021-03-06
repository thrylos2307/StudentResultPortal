module.exports.checkAuthenticated=(req, res, next)=>{
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  module.exports.checkNotAuthenticated=(req, res, next)=>{
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }