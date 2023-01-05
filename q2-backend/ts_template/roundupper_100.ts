import express from "express";

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number; y: number };
type spaceCowboy = { name: string; lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
  | { type: "space_cowboy"; metadata: spaceCowboy; location: location }
  | { type: "space_animal"; metadata: spaceAnimal; location: location };

// === ADD YOUR CODE BELOW :D ===

const calcDistance = (location1: location, location2: location) => {
  return Math.sqrt(
    Math.pow(location1.x - location2.x, 2) +
      Math.pow(location1.y - location2.y, 2)
  );
};

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();
app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post("/entity", (req, res) => {
  // TODO: fill me in
  let { entities } = req.body;
  for (const entity of entities) {
    spaceDatabase.push(entity);
  }
  res.status(200).send();
});

// lasooable returns all the space animals a space cowboy can lasso given their name
app.get("/lassoable", (req, res) => {
  let cowboy = spaceDatabase.filter(
    (entity: spaceEntity) =>
      entity.type === "space_cowboy" &&
      entity.metadata.name === req.body["cowboy_name"]
  )[0];

  let animals = spaceDatabase.filter(
    (entity: spaceEntity) =>
      entity.type === "space_animal" &&
      calcDistance(cowboy.location, entity.location) <=
        (cowboy.metadata as spaceCowboy).lassoLength
  );

  res.status(200).send({
    space_animals: animals.map((animal: spaceEntity) => ({
      type: (animal.metadata as spaceAnimal).type,
      location: animal.location,
    })),
  });
});

app.listen(8080);
