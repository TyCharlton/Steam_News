# Remote library imports
from flask import Flask, request, make_response, session, jsonify
from flask_restful import Api, Resource
from flask_migrate import Migrate
from datetime import datetime
import os
import requests
from flask_cors import CORS
import pytz

# Local imports
from config import app, db, api
from models import *
from datetime import datetime


class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if not user:
            return make_response({'error': "Unauthorized: you must be logged in to make that request"}, 401)
        else:
            return make_response(user.to_dict(), 200)

api.add_resource(CheckSession, '/check_session', endpoint='check_session')

@app.route('/createaccount', methods=['POST', 'OPTIONS'])
def create_account():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
    elif request.method == 'POST':
        json = request.get_json()
        try:
            user = User(
                username=json['username'],
                name=json['name'],
                prof_image_url=json['prof_image_url'],
            )
            user.password_hash = json['password']
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return make_response(user.to_dict(), 201)
        except Exception as e:
            return make_response({'errors': str(e)}, 422)
    else:
        return make_response({'error': 'Method not allowed'}, 405)

class Login(Resource):
    def post(self):
        username = request.get_json()['username']

        user = User.query.filter(User.username == username).first()
        password = request.get_json()['password']

        if not user:
            response_body = {'error': 'User not found.'}
            status = 404

        else:
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

allowed_endpoints = ['create_account', 'get', 'check_if_logged_in', 'login', 'logout', 'check_session', 'get_games', 'get_game', 'comments', 'get_comment', 'news', 'steamnews', 'games', 'get_comments', 'get_news', 'get_steamnews', 'get_news_for_app', 'get_update_or_delete_user']
@app.before_request
def check_if_logged_in():
    if request.method == "OPTIONS":
        # Allow OPTIONS requests to pass through without authentication
        return None
    if not session.get('user_id') and request.endpoint not in allowed_endpoints:
        return {'error': 'Unauthorized'}, 401

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

@app.route('/comments', methods=['GET', 'POST'])
def comments():
    if request.method == 'GET':
        comments = db.session.query(Comments, User).join(User, Comments.user_id == User.id).all()
        comments_list = [{
            'id': comment.id,
            'user_id': comment.user_id,
            'username': user.username,
            'comment_desc': comment.comment_desc
        } for comment, user in comments]
        return make_response(jsonify(comments_list), 200)
    elif request.method == 'POST':
        # user_id = session.get('user_id')
        # if user_id is None:
        #     return make_response(jsonify({'error': 'Unauthorized: you must be logged in to make that request'}), 401)
        json = request.get_json()
        comment = Comments(
            user_id=json['user_id'],
            news_id=json['news_id'],
            comment_desc=json['comment_desc']
        )
        db.session.add(comment)
        db.session.commit()
        return make_response(jsonify(comment.to_dict()), 201)
    else:
        return make_response(jsonify({'error': 'Method not allowed'}), 405)
        


@app.route('/comments/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def get_comment(id):
    print("Session user_id:", session.get('user_id'))
    if request.method == 'GET':
        comment = Comments.query.filter(id)
        if comment is None:
            return make_response(jsonify({'error': 'Comment not found'}), 404)
        return make_response(jsonify(comment.to_dict()), 200)
    elif request.method == 'PATCH':
        print("Session user_id:", session.get('user_id'))
        comment = Comments.query.get(id)
        if comment is None:
            return make_response(jsonify({'error': 'Comment not found'}), 404)
        json = request.get_json()
        for key, value in json.items():
            setattr(comment, key, value)
        db.session.commit()
        return make_response(jsonify(comment.to_dict()), 200)
    elif request.method == 'DELETE':
        comment = Comments.query.get(id)
        if comment is None:
            return make_response(jsonify({'error': 'Comment not found'}), 404)
        db.session.delete(comment)
        db.session.commit()
        return make_response({}, 204)
    else:
        return make_response(jsonify({'error': 'Method not allowed'}), 405)

@app.route('/news', methods=['GET'])
def get_news():
    news = News.query.all()
    news_data = [news.to_dict() for news in news]
    response = make_response(jsonify(news_data), 200)
    return response


@app.route('/news/<int:appid>', methods=['GET'])
def get_news_for_app(appid):
    eastern = pytz.timezone('America/New_York')
    news = News.query.filter_by(app_id=appid).order_by(News.news_date.desc()).first()
    if news:
        return make_response(jsonify(news.to_dict()), 200)
    else:
        url = f'https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid={appid}&count=3&maxlength=100000&format=json'
        response = requests.get(url)
        
        if response.status_code == 200:
            news_data = response.json().get('appnews', {}).get('newsitems', [])
            for item in news_data:
                news_date = datetime.fromtimestamp(item.get('date', 0), eastern) 
                game = Game.query.filter_by(appid=appid).first()
                if game:
                    existing_news = News.query.filter_by(
                        app_id=appid,
                        news_title=item.get('title', ''),
                        news_desc=item.get('contents', ''),
                        news_date=news_date
                    ).first()
                    if not existing_news:
                        news = News(
                            app_id=appid,
                            game_id=game.id, 
                            game_title=game.game_title,  # Set game_title here
                            news_title=item.get('title', ''),
                            news_desc=item.get('contents', ''),
                            game_url=item.get('url', ''),
                            news_author=item.get('author', ''),
                            news_date=news_date
                        )
                        db.session.add(news)
            db.session.commit()
            
            return make_response(jsonify({'message': 'News updated successfully'}), 200)
        else:
            return make_response(jsonify({'error': 'Failed to fetch news'}), 500)






@app.route('/user', methods=['GET'])
def get_all_users():
    users = User.query.all()
    if not users:
        return make_response(jsonify({'error': 'No users found'}), 404)
    
    user_list = [user.to_dict() for user in users]
    return make_response(jsonify(user_list), 200)

@app.route('/user/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def get_update_or_delete_user(id):
    user = User.query.get(id)
    if user is None:
        return make_response(jsonify({'error': 'User not found'}), 404)
    if request.method == 'GET':
        return make_response(jsonify(user.to_dict()), 200)
    elif request.method == 'PATCH':
        json = request.get_json()
        if 'name' in json:
            user.name = json['name']
        if 'prof_image_url' in json:
            user.prof_image_url = json['prof_image_url']
        db.session.commit()
        return make_response(jsonify(user.to_dict()), 200)
    elif request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        return make_response({}, 204)
    else:
        return make_response(jsonify({'error': 'Method not allowed'}), 405)
    


if __name__ == '__main__':
    app.run(port=5555, debug=True)