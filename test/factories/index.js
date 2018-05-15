/* eslint-disable */
import factory, {SequelizeAdapter} from 'factory-girl';
factory.setAdapter(new SequelizeAdapter());

const allYear = require('./allYear')(factory);
const classification = require('./classification')(factory);
const gauge = require('./gauge')(factory);

export default factory;
