#Remote library imports
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import re
from config import db

#Local imports
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    _password_hash = db.Column(db.String)
    prof_image_url = db.Column(db.String, nullable=True)  # Add this column

    comments = db.relationship('Comments', back_populates='user')

    @validates('name', 'username', '_password_hash')
    def validate_name(self, key, name):
        if not name:
            raise ValueError('Name cannot be empty.')
        return name

    def validate_email(self, key, username):
        if not re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', username):
            raise ValueError("Username must be a valid email format")
        return username

    def validate_password(self, key, password):
        if not password:
            raise ValueError('Password cannot be empty.')
        return password

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    serialize_rules = ('-_password_hash', '-comments.user')


class Game (db.Model, SerializerMixin):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key = True)
    appid = db.Column(db.Integer, nullable=False)
    game_title = db.Column(db.String, nullable=False)

    news = db.relationship('News', back_populates='game')
    comments = db.relationship('Comments', back_populates='game')




class News (db.Model, SerializerMixin):
    __tablename__ = 'news'

    id = db.Column(db.Integer, primary_key = True)
    app_id = db.Column(db.Integer, nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable= False)
    news_title = db.Column(db.String, nullable=False)
    news_desc = db.Column(db.String, nullable=False)
    game_url = db.Column(db.String, nullable=False)
    news_author = db.Column(db.String, nullable=False)
    news_date = db.Column(db.DateTime, nullable=False)

    game = db.relationship('Game', back_populates='news')

    serialize_rules = ('-news.game', )
    
class Comments(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    comment_desc = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)

    user = db.relationship('User', back_populates='comments')
    game = db.relationship('Game', back_populates='comments')

    serialize_rules = ('-user', '-game')



    