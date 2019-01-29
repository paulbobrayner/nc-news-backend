exports.handle400 = (err, req, res, next) => {
  const codes = {
    23502: 'violates not null violation',
    '22P02': 'invalid input syntax for type integer',
  };
  console.log(err.code);
  if (codes[err.code]) res.status(400).send({ msg: codes[err.code] });
  else next(err);
};
