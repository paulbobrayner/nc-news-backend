exports.handle400 = (err, req, res, next) => {
  // console.log(err);
  const codes = {
    42703: 'request body provided is in incorrect format',
    '22P02': 'please provide id in number format',
  };
  //  console.log(err);
  if (codes[err.code]) res.status(400).send({ msg: codes[err.code] });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  // console.log(err);
  if (err.status === 404) res.status(404).send({ msg: err.message });
  else next(err);
};
