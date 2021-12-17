const { PointOfInterest } = require("../models");

const controller = {
  addPointOfInterest: async (req, res) => {
    try {
      const { name, observation, city, grade } = req.body;

      const errors = [];

      if (!name) {
        errors.push("name is empty");
      }

      if (!city) {
        errors.push("city is empty");
      }
      if (!grade) {
        errors.push("grade is empty");
      }

      if (errors.length === 0) {
        const pointOfInterest = await PointOfInterest.create({
          name,
          observation,
          city,
          grade,
          userId: req.session.id,
        });
        res.status(201).send({
          message: `PointOfInterest was sucessfull created`,
        });
      } else {
        res.status(400).send({ errors });
      }
      //
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getPointOfInterests: async (req, res) => {
    try {
      const pointOfInterests = await PointOfInterest.findAll({
        where: { userId: req.session.id },
      });
      res.status(200).send(pointOfInterests);

      //
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },

  getAllPointOfInterests: async (req, res) => {
    try {
      const pointOfInterests = await PointOfInterest.findAll();
      res.status(200).send(pointOfInterests);

      //
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  editPointOfInterest: async (req, res) => {
    try {
      const { name, observation, city, grade, id } = req.body;

      const errors = [];
      const pointOfInterest = await PointOfInterest.findOne({ where: { id } });

      if (!pointOfInterest) {
        errors.push("PointOfInterest doesn't exists");
      }

      if (!name) {
        errors.push("name is empty");
      }

      if (!city) {
        errors.push("city is empty");
      }
      if (!grade) {
        errors.push("grade is empty");
      }

      if (errors.length === 0) {
        await pointOfInterest.update({
          ...pointOfInterest,
          name,
          observation,
          city,
          grade,
        });

        res.status(200).send({
          message: `PointOfInterest was sucessfull edited`,
        });
      } else {
        res.status(400).send({ errors });
      }
      //
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  deletePointOfInterest: async (req, res) => {
    try {
      const { id } = req.body;

      const errors = [];
      const pointOfInterest = await PointOfInterest.findOne({ where: { id } });

      if (!pointOfInterest) {
        errors.push("PointOfInterest doesn't exists");
      }

      if (errors.length === 0) {
        await pointOfInterest.destroy();

        res.status(200).send({
          message: `PointOfInterest was sucessfull deleted`,
        });
      } else {
        res.status(400).send({ errors });
      }
      //
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
};

module.exports = controller;
