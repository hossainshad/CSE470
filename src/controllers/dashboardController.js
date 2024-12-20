export const dashboard = (req, res) => {
    const user = req.session.user;
    console.log(user)
    res.render('dashboard', {user});
  };