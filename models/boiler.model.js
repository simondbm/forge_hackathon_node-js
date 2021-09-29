const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const BoilerModel = new Schema({
    name: { type: String },
    componentId: { type: Number },
    componentType: { type: String },
    componentAge: { type: Number },
    measuredThickness: { type: Number },
    installationDate: { type: Date },
    outerDiameter: { type: Number },
    designTemp: { type: Number },
    designPressure: { type: Number },
    area: { type: Number },
    material: {type: String},

},
{
    collection: 'boiler'
},
{
    timestamps: true,
});

const Boiler = mongoose.model('Boiler', BoilerModel);
module.exports = Boiler;