"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Users, Favourites_people, People, Vehicles, Favourites_vehicles, Favourites_planets, Planets
from api.utils import generate_sitemap, APIException

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_bcrypt import Bcrypt

import datetime

api = Blueprint('api', __name__)
app = Flask(__name__)

# Setup B-crypt
bcrypt = Bcrypt(app)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hsf! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    user_name = request.json.get("user_name", None)
    first_name = request.json.get("first_name", None)
    last_name = request.json.get("last_name", None)
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Check if properties of user exist
    if user_name is None:
        return jsonify({"msg": "User name not found"}), 400
    if first_name is None:
        return jsonify({"msg": "First name not found"}), 400
    if last_name is None:
        return jsonify({"msg": "Last name not found"}), 400
    if email is None:
        return jsonify({"msg": "Email not found"}), 400
    if password is None:
        return jsonify({"msg": "Password not found"}), 400

    user_name = user_name.capitalize().replace(" ", "")
    first_name = first_name.capitalize().replace(" ", "")
    last_name = last_name.capitalize()
    email = email.capitalize().replace(" ", "")

    # Check if username or email already exist in Users
    user = Users.query.filter((Users.email == email) | (
        Users.user_name == user_name)).first()
    if user != None:
        return jsonify({"msg": "Email or username already exist"}), 401

    # Encrypt password
    pw_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    print(pw_hash)
    print(password)
    user = Users(user_name=user_name, first_name=first_name,
                 last_name=last_name, email=email, password=pw_hash)

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "Ok. User created."}), 200

# LOGIN


@api.route('/login', methods=['POST'])
def login():
    r = request.get_json(force=True)

    # Check password & username|email
    if "email" in r:
        user = Users.query.filter((Users.user_name == r["email"].replace(" ", "").capitalize()) | (
            Users.email == r["email"].replace(" ", "").capitalize())).first()
    else:
        return jsonify({"msg": "Email property not found"}), 400

    if user is None:
        return jsonify({"msg": "User not found on database"}), 401

    if "password" not in r:
        return jsonify({"msg": "Password not found"}), 400

    print(r["password"])
    # Check password
    check_password = bcrypt.check_password_hash(user.password, r["password"])
    if not check_password:
        return jsonify({"msg": "Incorrect password"}), 401

    # Create Access Token

    access_token = create_access_token(
        identity=user.id, expires_delta=datetime.timedelta(days=1))

    response_body = {"msg": "Ok",
                     "token": access_token,
                     "user": user.serialize()}

    return jsonify(response_body), 200

# PRIVATE


@api.route('/private', methods=["GET"])
@jwt_required()
def private():

    current_user = get_jwt_identity()

    user = Users.query.get(current_user)

    if user == None:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({"msg": f"Logged in as {user.user_name}",
                    "response": user.serialize()}), 200


# GET ALL ENDPOINTS
# USERS


@api.route('/users', methods=['GET'])
def users_get_all():
    response_body = {}
    users = list(map(lambda item: item.serialize(), Users.query.all()))

    if not users:
        return jsonify(response_body), 204  # No content

    response_body["msg"] = "Ok"
    response_body["response"] = users
    return jsonify(response_body), 200


@api.route('/users/<int:id>', methods=['GET'])
def users_get_one(id):
    response_body = {}
    user = Users.query.get(id)

    if user == None:
        response_body["msg"] = f"Not found. User with id {id} doesn't exist"
        return jsonify(response_body), 404

    response_body["msg"] = "Ok"
    response_body["response"] = user.serialize()
    return jsonify(response_body), 200

# PEOPLE


@api.route('/people', methods=['GET'])
def people_get_all():
    response_body = {}
    people = list(map(lambda item: item.serialize(), People.query.all()))

    if not people:
        return jsonify(response_body), 204  # No content

    response_body["msg"] = "Ok"
    response_body["response"] = people
    return jsonify(response_body), 200


@api.route('/people/<int:id>', methods=['GET'])
def people_get_one(id):

    response_body = {}
    person = People.query.get(id)

    if person == None:
        response_body["msg"] = f"Not found. Person with id {id} doesn't exist"
        return jsonify(response_body), 404

    response_body["msg"] = "Ok"
    response_body["response"] = person.serialize()
    return jsonify(response_body), 200


# VEHICLES

@api.route('/vehicles', methods=['GET'])
def vehicles_get_all():
    response_body = {}

    vehicles = list(map(lambda item: item.serialize(), Vehicles.query.all()))

    if not vehicles:
        return jsonify(response_body), 204  # No content

    response_body["msg"] = "Ok"
    response_body["response"] = vehicles

    return jsonify(response_body), 200


@api.route('/vehicles/<int:id>', methods=['GET'])
def vehicles_get_one(id):
    response_body = {}
    vehicle = Vehicles.query.get(id)

    if vehicle == None:
        response_body["msg"] = f"Vehicle with id {id} doesn't exist"
        return jsonify(response_body), 404

    response_body["msg"] = "Ok"
    response_body["response"] = vehicle.serialize()
    return jsonify(response_body), 200


# PLANETS

@api.route('/planets', methods=['GET'])
def planets_get_all():
    response_body = {}
    planets = list(map(lambda item: item.serialize(), Planets.query.all()))

    if not planets:
        return jsonify(response_body), 204  # No content

    response_body["msg"] = "Ok"
    response_body["response"] = planets

    return jsonify(response_body), 200


@api.route('/planets/<int:id>', methods=['GET'])
def planets_get_one(id):
    response_body = {}
    planet = Planets.query.get(id)

    if planet == None:
        response_body["msg"] = f"Planet with id {id} doesn't exist"
        return jsonify(response_body), 404

    response_body["msg"] = "Ok"
    response_body["response"] = planet.serialize()
    return jsonify(response_body), 200


# POST PEOPLE
@api.route('/people', methods=['POST'])
def people_post():
    response_body = {}

    r = request.get_json(force=True)

    # Check if empty
    if r is None:
        response_body["msg"] = "The request body is null"
        return jsonify(response_body), 400

    # Check if propierties exists
    if not "name" in r:
        response_body["msg"] = "Name not found"
        return jsonify(response_body), 400

    if not "mass" in r:
        response_body["msg"] = "Mass not found"
        return jsonify(response_body), 400

    if not "height" in r:
        response_body["msg"] = "Height not found"
        return jsonify(response_body), 400

    if not "hair_color" in r:
        response_body["msg"] = "Hair color not found"
        return jsonify(response_body), 400

    if not "gender" in r:
        response_body["msg"] = "Gender not found"
        return jsonify(response_body), 400

    if not "eye_color" in r:
        response_body["msg"] = "Eye color not found"
        return jsonify(response_body), 400

    if not "birth_year" in r:
        response_body["msg"] = "Birth year not found"
        return jsonify(response_body), 400

    # Check types
    if type(r["name"]) != str:
        response_body["msg"] = "Name must be a string"
        return jsonify(response_body), 400

    if type(r["birth_year"]) != str:
        response_body["msg"] = "Birth year must be a string"
        return jsonify(response_body), 400

    if type(r["eye_color"]) != str:
        response_body["msg"] = "Eye color must be a string"
        return jsonify(response_body), 400

    if type(r["gender"]) != str:
        response_body["msg"] = "Gender must be a string"
        return jsonify(response_body), 400

    if type(r["hair_color"]) != str:
        response_body["msg"] = "Hair color must be a string"
        return jsonify(response_body), 400

    if type(r["height"]) != int:
        response_body["msg"] = "Height must be a integer"
        return jsonify(response_body), 400

    if type(r["mass"]) != int:
        response_body["msg"] = "Mass must be a integer"
        return jsonify(response_body), 400

    # Check unique name
    filter_name = People.query.filter_by(
        name=r["name"]).first()

    if filter_name != None:
        response_body["msg"] = "Name must be unique"
        return jsonify(response_body), 400

    # Insert in table
    person = People(name=r["name"], gender=r["gender"], birth_year=r["birth_year"],
                    eye_color=r["eye_color"], hair_color=r["hair_color"], mass=r["mass"], height=r["height"])

    db.session.add(person)
    db.session.commit()

    response_body["msg"] = "ok"
    return jsonify(response_body), 200

# POST VEHICLES


@api.route('/vehicles', methods=['POST'])
def vehicles_post():

    response_body = {}

    r = request.get_json(force=True)

    # Check if empty
    if r is None:
        return "The request body is null", 400

    # Check if propierties exists
    if not "name" in r:
        response_body["msg"] = "Name not found"
        return jsonify(response_body), 400

    if not "cargo_capacity" in r:
        response_body["msg"] = "Cargo Capacity not found"
        return jsonify(response_body), 400

    if not "consumables" in r:
        response_body["msg"] = "Consumables not found"
        return jsonify(response_body), 400

    if not "cost_in_credits" in r:
        response_body["msg"] = "Cost in credits color not found"
        return jsonify(response_body), 400

    if not "crew" in r:
        response_body["msg"] = "Crew not found"
        return jsonify(response_body), 400

    if not "length" in r:
        response_body["msg"] = "Length color not found"
        return jsonify(response_body), 400

    if not "manufacturer" in r:
        response_body["msg"] = "Manufacturer not found"
        return jsonify(response_body), 400

    if not "max_atmosphering_speed" in r:
        response_body["msg"] = "Max atmosphering speed not found"
        return jsonify(response_body), 400

    if not "model" in r:
        response_body["msg"] = "Model not found"
        return jsonify(response_body), 400

    if not "passengers" in r:
        response_body["msg"] = "Passengers not found"
        return jsonify(response_body), 400

    if not "vehicle_class" in r:
        response_body["msg"] = "Vehicle class not found"
        return jsonify(response_body), 400

    # Check types
    if type(r["name"]) != str:
        response_body["msg"] = "Name must be a string"
        return jsonify(response_body), 400

    if type(r["cargo_capacity"]) != int:
        response_body["msg"] = "Cargo capacity must be a integer"
        return jsonify(response_body), 400

    if type(r["consumables"]) != str:
        response_body["msg"] = "Consumables must be a string"
        return jsonify(response_body), 400

    if type(r["cost_in_credits"]) != int:
        response_body["msg"] = "Cost in credits must be a integer"
        return jsonify(response_body), 400

    if type(r["crew"]) != int:
        response_body["msg"] = "Crew must be a integer"
        return jsonify(response_body), 400

    if type(r["length"]) != int:
        response_body["msg"] = "Length must be a integer"
        return jsonify(response_body), 400

    if type(r["manufacturer"]) != str:
        response_body["msg"] = "Manufacturer must be a string"
        return jsonify(response_body), 400

    if type(r["max_atmosphering_speed"]) != int:
        response_body["msg"] = "Max atmosphering speed capacity must be a integer"
        return jsonify(response_body), 400

    if type(r["model"]) != str:
        response_body["msg"] = "Model must be a string"
        return jsonify(response_body), 400

    if type(r["vehicle_class"]) != str:
        response_body["msg"] = "Vehicle class must be a string"
        return jsonify(response_body), 400

    if type(r["passengers"]) != int:
        response_body["msg"] = "Passengers capacity must be a integer"
        return jsonify(response_body), 400

    # Check unique name
    filter_name = Vehicles.query.filter_by(
        name=r["name"]).first()

    if filter_name != None:
        response_body["msg"] = "Name must be unique"
        return jsonify(response_body), 400

    # Insert in table
    vehicle = Vehicles(name=r["name"], model=r["model"], vehicle_class=r["vehicle_class"],
                       manufacturer=r["manufacturer"], cost_in_credits=r["cost_in_credits"],
                       length=r["length"], crew=r["crew"], passengers=r["passengers"],
                       max_atmosphering_speed=r["max_atmosphering_speed"],
                       cargo_capacity=r["cargo_capacity"], consumables=r["consumables"])

    db.session.add(vehicle)
    db.session.commit()

    response_body["msg"] = "ok"
    return jsonify(response_body), 200


# POST PLANETS
@api.route('/planets', methods=['POST'])
def planets_post():
    response_body = {}

    r = request.get_json(force=True)

    # Check if empty
    if r is None:
        return "The request body is null", 400

    # Check if propierties exists
    if not "name" in r:
        response_body["msg"] = "Name not found"
        return jsonify(response_body), 400

    if not "climate" in r:
        response_body["msg"] = "Climate not found"
        return jsonify(response_body), 400

    if not "diameter" in r:
        response_body["msg"] = "Diameter not found"
        return jsonify(response_body), 400

    if not "gravity" in r:
        response_body["msg"] = "Gravity in credits color not found"
        return jsonify(response_body), 400

    if not "orbital_period" in r:
        response_body["msg"] = "Orbital period not found"
        return jsonify(response_body), 400

    if not "population" in r:
        response_body["msg"] = "Population color not found"
        return jsonify(response_body), 400

    if not "rotation_period" in r:
        response_body["msg"] = "Rotation period year not found"
        return jsonify(response_body), 400

    if not "surface_water" in r:
        response_body["msg"] = "Surface water speed year not found"
        return jsonify(response_body), 400

    if not "terrain" in r:
        response_body["msg"] = "Terrain year not found"
        return jsonify(response_body), 400

    # Check types

    if type(r["name"]) != str:
        response_body["msg"] = "Name must be a string"
        return jsonify(response_body), 400

    if type(r["climate"]) != str:
        response_body["msg"] = "Climate must be a string"
        return jsonify(response_body), 400

    if type(r["gravity"]) != str:
        response_body["msg"] = "Gravity must be a string"
        return jsonify(response_body), 400

    if type(r["terrain"]) != str:
        response_body["msg"] = "Terrain must be a string"
        return jsonify(response_body), 400

    if type(r["diameter"]) != int:
        response_body["msg"] = "Diameter must be a integer"
        return jsonify(response_body), 400

    if type(r["orbital_period"]) != int:
        response_body["msg"] = "Orbital period must be a integer"
        return jsonify(response_body), 400

    if type(r["population"]) != int:
        response_body["msg"] = "Population must be a integer"
        return jsonify(response_body), 400

    if type(r["rotation_period"]) != int:
        response_body["msg"] = "Rotation period must be a integer"
        return jsonify(response_body), 400

    if type(r["surface_water"]) != int:
        response_body["msg"] = "Surface water must be a integer"
        return jsonify(response_body), 400

    # Check unique name
    filter_name = Planets.query.filter_by(
        name=r["name"]).first()
    if filter_name != None:
        response_body["msg"] = "Name must be unique"
        return jsonify(response_body), 400

    planet = Planets(name=r["name"], climate=r["climate"], diameter=r["diameter"],
                     gravity=r["gravity"], orbital_period=r["orbital_period"],
                     population=r["population"], rotation_period=r["rotation_period"],
                     surface_water=r["surface_water"], terrain=r["terrain"])

    db.session.add(planet)
    db.session.commit()

    response_body["msg"] = "ok"
    return jsonify(response_body), 200


# DELETE PEOPLE
@api.route('/people/<int:id>', methods=['DELETE'])
def delete_people(id):
    response_body = {}

    person = People.query.get(id)

    if person == None:
        response_body["msg"] = f"Person with id {id} doesn't exist"
        return jsonify(response_body), 400

    db.session.delete(person)
    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200

# DELETE VEHICLES


@api.route('/vehicles/<int:id>', methods=['DELETE'])
def delete_vehicles(id):
    response_body = {}

    vehicle = Vehicles.query.get(id)

    if vehicle == None:
        response_body["msg"] = f"Vehicle with id {id} doesn't exist"
        return jsonify(response_body), 400

    db.session.delete(vehicle)
    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200

# DELETE PLANETS


@api.route('/planets/<int:id>', methods=['DELETE'])
def delete_planets(id):
    response_body = {}

    planet = People.query.get(id)

    if planet == None:
        response_body["msg"] = f"Planet with id {id} doesn't exist"
        return jsonify(response_body), 400

    db.session.delete(planet)
    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200


# MODIFY PEOPLE
@api.route('/people/<int:id>', methods=['PUT'])
def modify_people(id):
    response_body = {}

    r = request.get_json(force=True)
    person = People.query.get(id)

    # Check if empty
    if person == None:
        response_body["msg"] = f"Person with id {id} doesn't exist"
        return jsonify(response_body), 400

    # Check if propierties exists on request && type of them
    if "name" in r:
        if type(r["name"]) != str:
            response_body["msg"] = f"Name {r['name']} must be a string"
            return jsonify(response_body), 400

        # Check unique name
        filter_name = People.query.filter_by(
            name=r["name"]).first()

        if filter_name != None:
            response_body["msg"] = f"Name {r['name']} already exist"
            return jsonify(response_body), 400

        person.name = r["name"]

    if "birth_year" in r:
        if type(r["birth_year"]) != str:
            response_body["msg"] = f"Birth year {r['birth_year']} must be a string"
            return jsonify(response_body), 400

        person.birth_year = r["birth_year"]

    if "eye_color" in r:
        if type(r["eye_color"]) != str:
            response_body["msg"] = f"Eye color {r['eye_color']} must be a string"
            return jsonify(response_body), 400

        person.eye_color = r["eye_color"]

    if "gender" in r:
        if type(r["gender"]) != str:
            response_body["msg"] = f"Gender {r['gender']} must be a string"
            return jsonify(response_body), 400

        person.gender = r["gender"]

    if "hair_color" in r:
        if type(r["hair_color"]) != str:
            response_body["msg"] = f"Hair color {r['hair_color']} must be a string"
            return jsonify(response_body), 400

        person.hair_color = r["hair_color"]

    if "height" in r:
        if type(r["height"]) != int:
            response_body["msg"] = f"Height {r['height']} must be a integer"
            return jsonify(response_body), 400

        person.height = r["height"]

    if "mass" in r:
        if type(r["mass"]) != int:
            response_body["msg"] = f"Mass {r['mass']} must be a integer"
            return jsonify(response_body), 400

        person.mass = r["mass"]

    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200


# MODIFY VEHICLES
@api.route('/vehicles/<int:id>', methods=['PUT'])
def modify_vehicles(id):
    response_body = {}

    r = request.get_json(force=True)
    vehicle = Vehicles.query.get(id)

    # Check if empty
    if vehicle == None:
        response_body["msg"] = f"Vehicle with id {id} doesn't exist"
        return jsonify(response_body), 400

    # Check if propierties exists on request && type of them
    if "name" in r:
        if type(r["name"]) != str:
            response_body["msg"] = f"Name {r['name']} must be a string"
            return jsonify(response_body), 400

        # Check unique name
        filter_name = Vehicles.query.filter_by(
            name=r["name"]).first()

        if filter_name != None:
            response_body["msg"] = f"Name {r['name']} already exist"
            return jsonify(response_body), 400

        vehicle.name = r["name"]

    if "cargo_capacity" in r:
        if type(r["cargo_capacity"]) != int:
            response_body["msg"] = f"Cargo capacity {r['cargo_capacity']} must be a integer"
            return jsonify(response_body), 400

        vehicle.cargo_capacity = r["cargo_capacity"]

    if "consumables" in r:
        if type(r["consumables"]) != str:
            response_body["msg"] = f"Consumables {r['consumables']} must be a string"
            return jsonify(response_body), 400

        vehicle.consumables = r["consumables"]

    if "cost_in_credits" in r:
        if type(r["cost_in_credits"]) != int:
            response_body["msg"] = f"Cost in credits {r['cost_in_credits']} must be a integer"
            return jsonify(response_body), 400

        vehicle.cost_in_credits = r["cost_in_credits"]

    if "crew" in r:
        if type(r["crew"]) != int:
            response_body["msg"] = f"Crew {r['crew']} must be a integer"
            return jsonify(response_body), 400

        vehicle.crew = r["crew"]

    if "length" in r:
        if type(r["length"]) != int:
            response_body["msg"] = f"Length {r['length']} must be a integer"
            return jsonify(response_body), 400

        vehicle.length = r["length"]

    if "manufacturer" in r:
        if type(r["manufacturer"]) != str:
            response_body["msg"] = f"Manufacturer {r['manufacturer']} must be a string"
            return jsonify(response_body), 400

        vehicle.manufacturer = r["manufacturer"]

    if "max_atmosphering_speed" in r:
        if type(r["max_atmosphering_speed"]) != int:
            response_body["msg"] = f"Max atmosphering speed {r['max_atmosphering_speed']} must be a integer"
            return jsonify(response_body), 400

        vehicle.max_atmosphering_speed = r["max_atmosphering_speed"]

    if "model" in r:
        if type(r["model"]) != str:
            response_body["msg"] = f"Model {r['model']} must be a string"
            return jsonify(response_body), 400

        vehicle.model = r["model"]

    if "passengers" in r:
        if type(r["passengers"]) != int:
            response_body["msg"] = f"Passengers {r['passengers']} must be a integer"
            return jsonify(response_body), 400

        vehicle.passengers = r["passengers"]

    if "vehicle_class" in r:
        if type(r["vehicle_class"]) != str:
            response_body["msg"] = f"Vehicle class {r['vehicle_class']} must be a string"
            return jsonify(response_body), 400

        vehicle.vehicle_class = r["vehicle_class"]

    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200

# MODIFY PLANETS


@api.route('/planets/<int:id>', methods=['PUT'])
def modify_planets(id):
    response_body = {}

    r = request.get_json(force=True)
    planet = Planets.query.get(id)

    # Check if empty
    if planet == None:
        response_body["msg"] = f"Planet with id {id} doesn't exist"
        return jsonify(response_body), 400

    # Check if propierties exists on request && type of them
    if "name" in r:
        if type(r["name"]) != str:
            response_body["msg"] = f"Name class {r['name']} must be a string"
            return jsonify(response_body), 400

        # Check unique name
        filter_name = Planets.query.filter_by(
            name=r["name"]).first()

        if filter_name != None:
            response_body["msg"] = f"Name {r['name']} already exist"
            return jsonify(response_body), 400

        planet.name = r["name"]

    if "climate" in r:
        if type(r["climate"]) != str:
            response_body["msg"] = f"Climate class {r['climate']} must be a string"
            return jsonify(response_body), 400

        planet.climate = r["climate"]

    if "diameter" in r:
        if type(r["diameter"]) != int:
            response_body["msg"] = f"Diameter class {r['diameter']} must be a integer"
            return jsonify(response_body), 400

        planet.diameter = r["diameter"]

    if "gravity" in r:
        if type(r["gravity"]) != str:
            response_body["msg"] = f"Gravity class {r['gravity']} must be a string"
            return jsonify(response_body), 400

        planet.gravity = r["gravity"]

    if "orbital_period" in r:
        if type(r["orbital_period"]) != int:
            response_body["msg"] = f"Orbital period class {r['orbital_period']} must be a integer"
            return jsonify(response_body), 400

        planet.orbital_period = r["orbital_period"]

    if "population" in r:
        if type(r["population"]) != int:
            response_body["msg"] = f"Population class {r['population']} must be a integer"
            return jsonify(response_body), 400

        planet.population = r["population"]

    if "rotation_period" in r:
        if type(r["rotation_period"]) != int:
            response_body["msg"] = f"Rotation period class {r['rotation_period']} must be a integer"
            return jsonify(response_body), 400

        planet.rotation_period = r["rotation_period"]

    if "surface_water" in r:
        if type(r["surface_water"]) != int:
            response_body["msg"] = f"Surface water class {r['surface_water']} must be a integer"
            return jsonify(response_body), 400

        planet.surface_water = r["surface_water"]

    if "terrain" in r:
        if type(r["terrain"]) != str:
            response_body["msg"] = f"Terrain class {r['terrain']} must be a string"
            return jsonify(response_body), 400

        planet.terrain = r["terrain"]

    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200


# GET USER FAVOURITES
@api.route('/users/favorites/<int:id>', methods=['GET'])
@jwt_required()
def get_favourites(id):
    response_body = {}

    user = Users.query.get(id)
    if user == None:
        response_body["msg"] = f"Not Found. User with id {id} doesn't exist"
        return jsonify(response_body), 404

    favourites_people = list(map(lambda item: item.serialize(
    ), Favourites_people.query.filter_by(user_id=id).all()))

    favourites_vehicles = list(map(lambda item: item.serialize(
    ), Favourites_vehicles.query.filter_by(user_id=id).all()))

    favourites_planets = list(map(lambda item: item.serialize(
    ), Favourites_planets.query.filter_by(user_id=id).all()))

    favourites = [*favourites_people, *
                  favourites_vehicles, *favourites_planets]

    if not favourites:
        return jsonify(response_body), 204  # No content

    response_body["msg"] = "Ok"
    response_body["response"] = favourites
    return jsonify(response_body), 200


# POST PERSON FAVORITE
@api.route('/favorite/people/<int:people_id>/<int:user_id>', methods=['POST'])
@jwt_required()
def post_favourite_person(people_id, user_id):
    response_body = {}

    # Check if User exists
    user = Users.query.get(user_id)
    if user == None:
        response_body["msg"] = f"User with id {user_id} doesn't exist"
        return jsonify(response_body), 404

    # Check if Person exists
    person = People.query.get(people_id)
    if person == None:
        response_body["msg"] = f"Person with id {people_id} doesn't exist"
        return jsonify(response_body), 404

    # Check if person favourites already exist with the same user.
    person_user = Favourites_people.query.filter_by(
        user_id=user_id, person_id=people_id).first()  # AND FILTER

    if person_user != None:
        response_body["msg"] = f"User {user.user_name} with favorite person {person.name} already exist"
        return jsonify(response_body), 400

    favourite = Favourites_people(user_id=user_id, person_id=people_id)

    db.session.add(favourite)
    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200

# POST VEHICLE FAVORITE


@api.route('/favorite/vehicle/<int:vehicle_id>/<int:user_id>', methods=['POST'])
@jwt_required()
def post_favourite_vehicle(vehicle_id, user_id):
    response_body = {}

    # Check if User exists
    user = Users.query.get(user_id)
    if user == None:
        response_body["msg"] = f"User with id {user_id} doesn't exist"
        return jsonify(response_body), 404

    # Check if Person exists
    vehicle = Vehicles.query.get(vehicle_id)
    if vehicle == None:
        response_body["msg"] = f"Vehicle with id {vehicle_id} doesn't exist"
        return jsonify(response_body), 404

    # Check if person favourites already exist with the same user.
    vehicle_user = Favourites_vehicles.query.filter_by(
        user_id=user_id, vehicles_id=vehicle_id).first()  # AND FILTER

    if vehicle_user != None:
        response_body["msg"] = f"User {user.user_name} with favorite vehicle {vehicle.name} already exist"
        return jsonify(response_body), 400

    favourite = Favourites_vehicles(user_id=user_id, vehicles_id=vehicle_id)

    db.session.add(favourite)
    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200

# POST PLANET FAVORITE


@api.route('/favorite/planet/<int:planet_id>/<int:user_id>', methods=['POST'])
@jwt_required()
def post_favourite_planet(planet_id, user_id):
    response_body = {}

    # Check if User exists
    user = Users.query.get(user_id)
    if user == None:
        response_body["msg"] = f"User with id {user_id} doesn't exist"
        return jsonify(response_body), 404

    # Check if Person exists
    planet = Planets.query.get(planet_id)
    if planet == None:
        response_body["msg"] = f"Planets with id {planet_id} doesn't exist"
        return jsonify(response_body), 404

    # Check if person favourites already exist with the same user.
    planet_user = Favourites_planets.query.filter_by(
        user_id=user_id, planets_id=planet_id).first()  # AND FILTER

    if planet_user != None:
        response_body["msg"] = f"User {user.user_name} with favorite planet {planet.name} already exist"
        return jsonify(response_body), 400

    favourite = Favourites_planets(user_id=user_id, planets_id=planet_id)

    db.session.add(favourite)
    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200

# DELETE PERSON FAVORITE


@api.route('/favorite/people/<int:people_id>/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_favourite_people(people_id, user_id):
    response_body = {}

    # Check if User exists
    user = Users.query.get(user_id)
    if user == None:
        response_body["msg"] = f"User with id {user_id} doesn't exist"
        return jsonify(response_body), 404

    # Check if Person exists
    person = People.query.get(people_id)
    if person == None:
        response_body["msg"] = f"Person with id {people_id} doesn't exist"
        return jsonify(response_body), 404

    person_user = Favourites_people.query.filter_by(
        user_id=user_id, person_id=people_id).first()
    if person_user == None:
        response_body["msg"] = f"Favorite person {person.name} with user {user.user_name} doesn't exist"
        return jsonify(response_body), 404

    db.session.delete(person_user)
    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200

# DELETE VEHICLE FAVORITE


@api.route('/favorite/vehicle/<int:vehicle_id>/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_favourite_vehicle(vehicle_id, user_id):
    response_body = {}

    # Check if User exists
    user = Users.query.get(user_id)
    if user == None:
        response_body["msg"] = f"User with id {user_id} doesn't exist"
        return jsonify(response_body), 404

    # Check if Person exists
    vehicle = Vehicles.query.get(vehicle_id)
    if vehicle == None:
        response_body["msg"] = f"Vehicle with id {vehicle_id} doesn't exist"
        return jsonify(response_body), 404

    vehicle_user = Favourites_vehicles.query.filter_by(
        user_id=user_id, vehicles_id=vehicle_id).first()
    if vehicle_user == None:
        response_body["msg"] = f"Favorite vehicle {vehicle.name} with user {user.user_name} doesn't exist"
        return jsonify(response_body), 404

    db.session.delete(vehicle_user)
    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200

# DELETE PLANET FAVORITE


@api.route('/favorite/planet/<int:planet_id>/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_favourite_planet(planet_id, user_id):
    response_body = {}

    # Check if User exists
    user = Users.query.get(user_id)
    if user == None:
        response_body["msg"] = f"User with id {user_id} doesn't exist"
        return jsonify(response_body), 404

    # Check if Person exists
    planet = Planets.query.get(planet_id)
    if planet == None:
        response_body["msg"] = f"Planet with id {planet_id} doesn't exist"
        return jsonify(response_body), 404

    planet_user = Favourites_planets.query.filter_by(
        user_id=user_id, planets_id=planet_id).first()
    if planet_user == None:
        response_body["msg"] = f"Favorite planet {planet.name} with user {user.user_name} doesn't exist"
        return jsonify(response_body), 404

    db.session.delete(planet_user)
    db.session.commit()

    response_body["msg"] = "Ok"
    return jsonify(response_body), 200
