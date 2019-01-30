exports.getTime = data => data.map(({ created_by, ...article }) => {
  const formatTime = {
    ...article,
    username: created_by,
    created_at: new Date(article.created_at).toDateString(),
  };
    //  console.log(formatTime);
  return formatTime;
});

exports.articleRef = data => data.reduce((refObj, { article_id, title }) => {
  refObj[title] = article_id;
  return refObj;
}, {});

exports.formatComments = (refObj, comments) => comments.map(({
  belongs_to, created_at, created_by, ...restOfTheComments
}) => ({
  ...restOfTheComments,
  username: created_by,
  article_id: refObj[belongs_to],
  created_at: new Date(created_at).toDateString(),
}));

// above explained:
// destructuring properties from comments along with the rest of the comments
// then implicitly returning an object
// within curly braces - building up new object.
