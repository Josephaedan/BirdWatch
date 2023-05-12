const Sighting = require("../models/sightings");

// Get all sightings sorted by date/time seen and identification status (GET /sightings)
exports.getSightings = async (req, res) => {
  try {
    const sightings = await Sighting.find().sort({
      date: "desc",
      "identification.status": "asc",
    });
    // res.json(sightings);
    res.render('index', {sightings: sightings});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new sighting (POST /sightings)
exports.addSighting = async (req, res) => {
  const { date, latitude, longitude, description, userNickname } = req.body;
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
      identification: { status: "unknown", photoUrl: imagePath },
      userNickname,
      comments: [],
    });
    const newSighting = await sighting.save();
    // res.status(201).json(newSighting);
    // TODO: Implement new sighting page to redirect to
    res.status(201).redirect(`/sightings/${newSighting._id}`);
  } catch (err) {
    console.log(err.message);
    res.status(400).render("add", { error: err.message, sighting: req.body });
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
    // res.status(200).json(sighting);
    res.render('detail', {sighting: sighting});
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.render("chat", {comments: sightingComments});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update the identification of a sighting (PUT /sightings/:id/identification)
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
// TODO: Implement sightings view
exports.renderSightings = async (req, res) => {
  const sightings = await Sighting.find().sort({
    date: "desc",
    "identification.status": "asc",
  });
  res.render("sightings", { sightings });
};
