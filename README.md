<p align="center">
  <img width="200" height="200" src="public/images/logo.svg">
</p>

# BirdWatch - A Bird Sighting Progressive Web Application

**:information_source: Psst! BirdWatch is currently hosted live with a hosted MongoDB database! Check it out [here](https://birdwatch.up.railway.app/)!**

BirdWatch is a progressive web application for bird watchers to record and view bird sightings, as well as to help with bird identification. The application allows users to add new sightings, view a sorted list of all sightings, and comment on identification suggestions.

BirdWatch is developed for an assignment as part of [COM3504: The Intelligent Web](http://www.dcs.shef.ac.uk/intranet/teaching/public/modules/level3/com3504.html) Spring Semester 2022/2023 taught by The University of Sheffield. It is worked on by:

- Joseph Aedan Marcus [(Github)](https://github.com/Josephaedan)
- Hoemin Kim [(Github)](https://github.com/mimi-hwemin-kim)
- Megan Wee [(Github)](https://github.com/mweeruien)

## Features

The application includes the following features:

- Adding new bird sightings, including the date and time seen, location, description, and identification
- Viewing a sorted list of all bird sightings, sorted by date/time seen and identification status
- Commenting on each sighting via a live chat function that is saved online
- Linking identifications to information obtained from the DBPedia knowledge graph, including common name/scientific name, English description, and a URI linking to the DBPedia page describing the bird
- Offline functionality with background sync for adding sightings, comments or identification of sightings

## Getting Started

To run the application locally, follow these steps:

1. Ensure you have [Node.js](https://nodejs.org/en/download) and [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/) installed on your machine
2. Ensure MongoDB is running on your machine. More instructions can be found to run MongoDB on your platform can be found [here](https://www.mongodb.com/docs/manual/administration/install-community/)
3. Clone the repository to your machine: `git clone https://github.com/Josephaedan/BirdWatch.git`
4. Install dependencies in the root directory: `npm install`
5. BirdWatch uses environment variables to function which allows for customisation of the port that the server will run on, and the mongoDB server to connect to. This is done using a `.env` file to set the environment variables. Create a '.env' file in the root directory of the project and set the environment variables you would like to use. An example file '.env.example' has been provided for you to use as a template. The `.env` file should have a `PORT`, `MONGO_PORT` and `MONGO_URL`.
6. Start the server: `npm run start`
7. Open the application in your web browser at `http://localhost:<PORT>`. By default, the application will run on [port 3000](http://localhost:3000/) and the MongoDB instance will run on port 27017. If you wish to change this, you can do so by setting the `PORT` environment variable before starting the server. 

## Dependencies

The application uses the following dependencies:

- MongoDB: a document database that stores data in flexible, JSON-like documents
- Express: a fast and minimalist web framework for Node.js
- Mongoose: a MongoDB object modeling tool designed to work in an asynchronous environment
- EJS: a simple templating language that lets you generate HTML markup with plain JavaScript
- DBPedia Spotlight: a RESTful Web service that allows users to annotate text against a large, multilingual Wikipedia-based knowledge graph
- Bootstrap: a free and open-source CSS framework directed at responsive, mobile-first front-end web development
- Leaflet: an open-source JavaScript library for mobile-friendly interactive maps
- OpenStreetMap: a collaborative project to create a free editable map of the world

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
