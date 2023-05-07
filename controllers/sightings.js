const Sighting = require("../models/sightings");

// Get all sightings sorted by date/time seen and identification status
exports.getSightings = async (req, res) => {
  console.log("getSightings");
  try {
    const sightings = await Sighting.find().sort({
      date: "desc",
      "identification.status": "asc",
    });
    res.json(sightings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new sighting
exports.addSighting = async (req, res) => {
  const { date, location, description, userNickname } = req.body;
  try {
    const sighting = new Sighting({
      date,
      location,
      description,
      identification: { status: "unknown" },
      userNickname,
      comments: [],
    });
    const newSighting = await sighting.save();
    res.status(201).json(newSighting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update the identification of a sighting
exports.updateIdentification = async (req, res) => {
  const { id } = req.params;
  const {
    commonName,
    scientificName,
    englishDescription,
    uri,
    photoUrl,
    suggestedBy,
  } = req.body;
  try {
    const sighting = await Sighting.findById(id);
    if (!sighting) {
      return res.status(404).json({ message: "Sighting not found" });
    }
    if (sighting.identification.status !== "unknown") {
      return res
        .status(400)
        .json({ message: "Sighting has already been identified" });
    }
    sighting.identification = {
      commonName,
      scientificName,
      englishDescription,
      uri,
      photoUrl,
      status: "uncertain",
      suggestedBy,
      suggestedAt: new Date(),
    };
    const updatedSighting = await sighting.save();
    res.json(updatedSighting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add a comment to a sighting
exports.addComment = async (req, res) => {
  const { id } = req.params;    // id is type string
  const { userNickname, text } = req.body;
  try {
    const sighting = await Sighting.findById(id);
    if (!sighting) {
      return res.status(404).json({ message: "Sighting not found" });
    }
    sighting.comments.push({ userNickname, text });
    const updatedSighting = await sighting.save();
    res.json(updatedSighting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Render the sightings page
exports.renderSightings = async (req, res) => {
  const sightings = await Sighting.find().sort({
    date: "desc",
    "identification.status": "asc",
  });
  res.render("sightings", { sightings });
};
