export const renderPage = (view) => {
  return (req, res, next) => {
    res.locals.activePage = view;
    // console.log(res.locals);
    return res.render('layout', { page: view, ...res.locals });
  };
};
