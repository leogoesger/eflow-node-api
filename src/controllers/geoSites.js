import {GeoSite, GeoClass, GeoRegion} from '../models';

module.exports = {
  index(req, res) {
    try {
      GeoSite.findAll({
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'description',
            'geoClassId',
            'name',
          ],
        },
        include: [
          {
            model: GeoClass,
            as: 'geoClass',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'description'],
            },
            include: [{model: GeoRegion, as: 'geoRegion'}],
          },
        ],
      }).then(geoSites => res.status(200).send(geoSites));
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
};
