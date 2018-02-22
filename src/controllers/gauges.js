import {dataHandling} from '../utils/dataHandling';

module.exports = {
  show(req, res) {
    const data = dataHandling();
    res.status(200).send(data);
  },
};
