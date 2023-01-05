from dataclasses import dataclass
from enum import Enum
from typing import Union, NamedTuple, List
from flask import Flask, request
from math import sqrt, pow
# SpaceCowboy models a cowboy in our super amazing system
@dataclass
class SpaceCowboy:
    name: str
    lassoLength: int

# SpaceAnimal models a single animal in our amazing system
@dataclass
class SpaceAnimal:
    # SpaceAnimalType is an enum of all possible space animals we may encounter
    class SpaceAnimalType(Enum):
        PIG = "pig"
        COW = "cow"
        FLYING_BURGER = "flying_burger"

    type: SpaceAnimalType

# SpaceEntity models an entity in the super amazing (ROUND UPPER 100) system
@dataclass
class SpaceEntity:
    class Location(NamedTuple):
        x: int
        y: int

    metadata: Union[SpaceCowboy, SpaceAnimal]
    location: Location

# ==== HTTP Endpoint Stubs ====
app = Flask(__name__)
space_database: List[SpaceEntity] = []

# the POST /entity endpoint adds an entity to your global space database
@app.route('/entity', methods=['POST'])
def create_entity():
    entities = request.get_json()["entities"]
    for entity in entities:
        if (entity["type"] == 'space_cowboy'):
            space_database.append(SpaceEntity(SpaceCowboy(entity["metadata"]["name"], entity["metadata"]["lassoLength"]), SpaceEntity.Location(entity["location"]["x"], entity["location"]["y"])))
        else:
            space_database.append(SpaceEntity(SpaceAnimal(SpaceAnimal.SpaceAnimalType(entity["metadata"]["type"])), SpaceEntity.Location(entity["location"]["x"], entity["location"]["y"])))
    return {}, 200

# lasooable returns all the space animals a space cowboy can lasso given their name
@app.route('/lassoable', methods=['GET'])
def lassoable():
    cowboy = [cowboy for cowboy in space_database if type(cowboy.metadata) == SpaceCowboy and cowboy.metadata.name == request.get_json()["cowboy_name"]][0]
    animals = [animal for animal in space_database if type(animal.metadata) == SpaceAnimal and calcDistance(animal.location, cowboy.location) <= cowboy.metadata.lassoLength]
    return {"space_animals": [{"type": SpaceAnimal.SpaceAnimalType(animal.metadata.type).value, "location": {"x": animal.location.x, "y": animal.location.y} } for animal in animals]}, 200


def calcDistance(location1: SpaceEntity.Location, location2: SpaceEntity.Location) -> float:
    return sqrt(pow( location1.x - location2.x, 2) + pow(location1.y - location2.y, 2))


# DO NOT TOUCH ME, thanks :D
if __name__ == '__main__':
    app.run(debug=True, port=8080)