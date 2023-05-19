const Sighting = require("../models/sightings");

// Get all sightings sorted by date/time seen and identification status (GET /sightings)
exports.getSightings = async (req, res) => {
  try {
    const sightings = await Sighting.find().sort({
      date: "desc",
      "identification.status": "asc",
    });
    // res.json(sightings);
    res.render("index", { sightings: sightings });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add a new sighting (POST /sightings)
exports.addSighting = async (req, res) => {
  // Get the data from the request body
  const {
    date,
    latitude,
    longitude,
    description,
    userNickname,
    idCommonName,
    idScientificName,
    idDescription,
    idLink,
    idStatus,
  } = req.body;

  // Use the image path from the request file if it exists, otherwise use BirdWatch's placeholder image
  const imagePath = req.file
    ? `/images/uploads/${req.file.filename}`
    : "/images/placeholder.png";
  try {
    const sighting = new Sighting({
      date,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      description,
      identification: {
        commonName: idCommonName,
        scientificName: idScientificName,
        englishDescription: idDescription,
        uri: idLink,
        status: idStatus,
        photoUrl: imagePath,
      },
      userNickname,
      comments: [],
    });

    // Save the sighting to the database
    const newSighting = await sighting.save();

    // Redirect to the new sighting's page
    res.status(201).redirect(`/sightings/${newSighting._id}`);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single sighting (GET /sightings/:id)
exports.getSighting = async (req, res) => {
  const id = req.params.id;

  try {
    const sighting = await Sighting.findById(id);
    if (!sighting) {
      return res.status(404).json({ message: "Sighting not found" });
    }

    // Render the detail page with the sighting data
    res.render("detail", { sighting: sighting });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a single sighting's comments (GET /sightings/:id)
exports.getSightingComments = async (req, res) => {
  const id = req.params.id;
  try {
    const sighting = await Sighting.findById(id);
    if (!sighting) {
      return res.status(404).json({ message: "Sighting not found" });
    }
    const sightingComments = sighting.comments;

    res.render("chat", { comments: sightingComments });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update the identification of a sighting (POST /sightings/:id/identification)
exports.updateIdentification = async (req, res) => {
  const { id } = req.params;
  const { idCommonName, idScientificName, idDescription, idLink, idStatus } =
    req.body;
  try {
    const sighting = await Sighting.findById(id);
    if (!sighting) {
      return res.status(404).json({ message: "Sighting not found" });
    }
    sighting.identification.commonName = idCommonName;
    sighting.identification.scientificName = idScientificName;
    sighting.identification.englishDescription = idDescription;
    sighting.identification.uri = idLink;
    sighting.identification.status = idStatus;
    const updatedSighting = await sighting.save();
    res.json(updatedSighting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add a comment to a sighting (POST /sightings/:id/comments)
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

// Render the sightings page (GET /sightings)
exports.renderSightings = async (req, res) => {
  const sightings = await Sighting.find().sort({
    date: "desc",
    "identification.status": "asc",
  });
  res.render("sightings", { sightings });
};
