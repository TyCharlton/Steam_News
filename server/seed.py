#!/usr/bin/env python3

# Standard library imports
import requests

# Remote library imports
from faker import Faker

# Local imports
from config import app, db
from models import User, Game, Comments

def seed_users(num_users=10):
    fake = Faker()
    users = []
    for _ in range(num_users):
        user = User(
            name=fake.name(),
            username=fake.user_name(),
            _password_hash=fake.password(),
            prof_image_url=fake.image_url(),  
        )
        users.append(user)
    return users

def seed_games():
    response = requests.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
    data = response.json()
    games_data = data['applist']['apps']
    games = []
    for game_data in games_data:
        game = Game(
            appid=game_data['appid'],
            game_title=game_data['name'],
            
        )
        games.append(game)
    return games

def seed_comments(num_comments=10):
    fake = Faker()
    comments = []
    for _ in range(num_comments):
        comment = Comments(
            comment_desc=fake.text(),
            user_id=fake.random_int(min=1, max=10),  
            game_id=fake.random_int(min=1, max=10000),  
        )
        comments.append(comment)
    return comments

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        users = seed_users()
        games = seed_games()
        comments = seed_comments()

        db.create_all()
        db.session.add_all(users)
        db.session.add_all(games)
        db.session.add_all(comments)

        db.session.commit()

        print("Seed completed!")
