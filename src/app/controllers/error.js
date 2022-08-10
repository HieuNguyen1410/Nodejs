exports.get404 = (req, res, next) => {
  const role = req.staff.role;
  res.status(404).render("404", {
    role,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res, next) => {
  const role = req.staff.role;
  res.status(500).render("500", {
    role,
    isAuthenticated: req.session.isLoggedIn,
  });
};
