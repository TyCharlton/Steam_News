# Remote library imports
from flask import Flask, request, make_response, session, jsonify
from flask_restful import Api, Resource
from flask_migrate import Migrate
import os


# Local imports
from config import app, db, api
from models import *


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)


class CheckSession(Resource):
    # this allows a user to stay logged in to the site even after refresh
    # since the user_id will not be removed from the session until a request is
    # made to /logout
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if not user:
            return make_response({'error': "Unauthorized: you must be logged in to make that request"}, 401)
        else:
            return make_response(user.to_dict(), 200)

api.add_resource(CheckSession, '/check_session', endpoint='check_session')

class CreateAccount(Resource):

    def post(self):
        json = request.get_json()
        try:
            user = User(
                username=json['username'],
                name=json['name'],
            )
            user.password_hash = json['password']
            db.session.add(user)
            db.session.commit()
            # this line will and the user_id to your session, essentially
            # signing them into your site automatically on signup
            session['user_id'] = user.id

            return make_response(user.to_dict(), 201)

        except Exception as e:
            return make_response({'errors': str(e)}, 422)

api.add_resource(CreateAccount, '/createaccount', endpoint='createaccount')


class Login(Resource):

    def post(self):
        username = request.get_json()['username']

        user = User.query.filter(User.username == username).first()
        password = request.get_json()['password']

        if not user:
            response_body = {'error': 'User not found'}
            status = 404
        else:
            # this sends the password the user put in to the method in our
            # user class, and which will return True if it is a match to what
            # what is in our database--authenticating the user--or False if not
            if user.authenticate(password):
                session['user_id'] = user.id
                response_body = user.to_dict()
                status = 200
            else:
                response_body = {'error': 'Invalid username or password'}
                status = 401
        return make_response(response_body, status)

api.add_resource(Login, '/login', endpoint='login')

class Logout(Resource):
    
    def delete(self):
        session['user_id'] = None
        return {}, 204
    
api.add_resource(Logout, '/logout', endpoint='logout')

@app.route('/games', methods=['GET'])
def get_games():
    games = Game.query.all()
    games_data = [game.to_dict() for game in games]
    response = make_response(jsonify(games_data), 200)
    return response

@app.route('/games/<int:id>', methods=['GET'])
def get_game(id):
    game = Game.query.get(id)
    if game is None:
        return make_response(jsonify({'error': 'Game not found'}), 404)
    return make_response(jsonify(game.to_dict()), 200)


if __name__ == '__main__':
    app.run(port=5555, debug=True)