export const renderPage = (view) => {
  return (req, res, next) => {
    res.locals.activePage = view;
    return res.render('layout', { page: view, ...res.locals });
  };
};
