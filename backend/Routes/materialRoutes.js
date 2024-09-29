const express = require('express');
const router = express.Router();
const Material = require('../Models/Material');

// Create multiple materials
router.post('/', async (req, res) => {
  try {
    const materialsData = req.body;

    const createdMaterials = await Promise.all(materialsData.map(async (materialData) => {
      const {
        material_name,
        quantity,
        unit_price,
        supplier_name,
        supplier_contact,
        purchase_date,
        expiration_date,
        storage_location,
        material_type,
        weight
      } = materialData;

      // Create material
      const material = new Material({
        material_name,
        quantity,
        unit_price,
        supplier_name,
        supplier_contact,
        purchase_date,
        expiration_date,
        storage_location,
        material_type,
        weight
      });

      // Save material
      const savedMaterial = await material.save();

      return savedMaterial;
    }));

    res.status(201).json({ message: "Materials successfully created", data: createdMaterials });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all materials
router.get('/', async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific material by ID
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a specific material by ID
router.delete('/:id', async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json({ message: "Material successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
