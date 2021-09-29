const router = require('express').Router();
let Boiler = require('../models/boiler.model');


router.route('/').get((req, res) => {
    Boiler.find()
      .then(boiler => res.json(boiler))
      .catch(err => res.status(400).json('Error: ' + err));
  });
  
  router.route('/add').post((req, res) => {
    const name = req.body.name;
    const componentId = req.body.componentId;
    const measuredThickness = req.body.measuredThickness;
    const installationDate = req.body.installationDate;
    const outerDiameter = req.body.outerDiameter;
    const designTemp = req.body.designTemp;
    const area = req.body.area;
    const componentType = req.body.componentType;
    const designPressure = req.body.designPressure;
    const material = req.body.material;
    const componentAge = req.body.componentAge;

   
    const newBoiler = new Boiler({
      name,
      componentId,
      measuredThickness,
      installationDate,
      outerDiameter,
      designTemp,
      area,
      componentType,
      designPressure,
      material,
      componentAge,

    });
  
    newBoiler.save()
    .then(() => res.json('Boiler info added!'))
    .catch(err => res.status(400).json('Error: ' + err));
  });
  
router.route('/:id').get((req, res) => {
Boiler.findById(req.params.id)
    .then(boiler => res.json(boiler))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
Boiler.findByIdAndDelete(req.params.id)
    .then(() => res.json('Boiler deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
Boiler.findById(req.params.id)
    .then(boiler => {
    boiler.name = req.body.name;
    boiler.componentId = req.body.componentId;
    boiler.measuredThickness = req.body.measuredThickness;
    boiler.installationDate = req.body.installationDate;
    boiler.outerDiameter = req.body.outerDiameter;
    boiler.designTemp = req.body.designTemp;
    boiler.area = req.body.area;
    boiler.componentType = req.body.componentType;
    boiler.designPressure = req.body.designPressure;
    boiler.material = req.body.material;
    boiler.componentAge = req.body.componentAge;
    boiler.save()
        .then(() => res.json('Boiler info updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;