exports.getTime = (data) => {
  return data.map(({ created_by, ...article }) => {
    const formatTime = {
      ...article,
      username: created_by,
      created_at: new Date(article.created_at).toDateString(),
    };
    //  console.log(formatTime);
    return formatTime;
  });
};

exports.articleRef = (data) => {
  return data.reduce((refObj, { article_id, title }) => {
    refObj[title] = article_id;
    return refObj;
  }, {});
};

exports.formatComments = (refObj, comments) => {
  comments.map(({ belongs_to, created_at, created_by, ...restOfComment }) => ({
    ...restOfComment,
    username: created_by,
    article_id: refObj[belongs_to],
    created_at: new Date(created_at).toDateString(),
  }));
};

// exports.getTimeComments = (data) => {
//   return data.map((comment) => {
//     const formatTime = {
//       ...comment,
//       created_at: new Date(comment.created_at).toDateString(),
//     };
//     //   console.log(formatTime);
//     return formatTime;
//   });
// };
