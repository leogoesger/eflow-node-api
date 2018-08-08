import {GeoSite, GeoClass, GeoRegion} from '../models';

module.exports = {
  index(req, res) {
    try {
      GeoRegion.findAll({
        attributes: ['name', 'abbreviation'],
        include: [
          {
            model: GeoClass,
            as: 'geoClasses',
            include: [
              {
                model: GeoSite,
                as: 'geoSites',
                attributes: ['identity', 'imageUrl', 'geometry'],
              },
            ],
          },
        ],
      }).then(geoSites => res.status(200).send(geoSites));
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
};
