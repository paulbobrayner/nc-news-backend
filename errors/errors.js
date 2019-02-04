exports.handle400 = (err, req, res, next) => {
  // console.log(err);
  const codes = {
    42703: 'request body provided is in incorrect format',
    '22P02': 'please provide id in number format',
    23502: 'please provide correct input',
    400: 'malformed syntax',
  };
  // console.log(err.code);
  if (codes[err.code]) res.status(400).send({ msg: codes[err.code] });
  else next(err);
};

exports.handle404 = (err, req, res, next) => {
  // console.log(err);
  const codes = {
    23503: 'key non existent',
  };
  if (err.status === 404) res.status(404).send({ msg: err.message });
  if (codes[err.code]) res.status(404).send({ msg: codes[err.code] });
  else next(err);
};
exports.handle405 = (req, res, next) => {
  // console.log(err);
  res.status(405).send({ msg: 'invalid method for this endpoint' });
  // else next(err);
};
exports.handle422 = (err, req, res, next) => {
  // console.log(err);
  const codes = {
    23505: 'duplicate key',
  };
  if (codes[err.code]) res.status(422).send({ msg: codes[err.code] });
  else next(err);
};

exports.handle500 = (err, req, res, next) => {
  // console.log(err);
  if (err.status === 500) res.status(500).send({ msg: 'Internal server error' });
  else next(err);
};
