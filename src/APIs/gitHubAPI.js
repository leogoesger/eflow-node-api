import request from 'superagent';

const getCommitInfo = data => {
  const appInfo = {};
  appInfo.author = data.commit.author.name;
  appInfo.date = data.commit.author.date;
  appInfo.message = data.commit.message;
  appInfo.version = data.sha.slice(0, 10);
  const files = [];
  data.files.forEach(file => files.push(file.filename));

  appInfo.files = files;

  return appInfo;
};

module.exports = {
  async gitHubCommits(req, res) {
    try {
      const gitClient = await request
        .get(process.env.GH_API_CLIENT_URL)
        .then(data => data.body);
      const gitNode = await request
        .get(process.env.GH_API_NODE_API_URL)
        .then(data => data.body);
      const gitFlask = await request
        .get(process.env.GH_API_FLASK_API_URL)
        .then(data => data.body);

      const appInfo = {};
      appInfo.client = getCommitInfo(gitClient);
      appInfo.nodeAPI = getCommitInfo(gitNode);
      appInfo.flaskAPI = getCommitInfo(gitFlask);

      res.status(200).send(appInfo);
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
};
