#Remote library imports
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import re

#Local imports
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    _password_hash = db.Column(db.String)


    @validates('name', 'email')
    def validate_name(self, key, name):
        if not name:
            raise ValueError('Name cannot be empty.')
        return name
    
    def validate_email(self, key, email):
        if not re.match(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$', email):
            raise ValueError("Invalid email format")
        return email

    @hybrid_property
    # this will prevent our password_hash from being returned in a request 
    # to users
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
    
    # this prevents that Exception being raised everytime we try to call the 
    # .to_dict() method in a request that returns information from users
    serialize_rules = ('-_password_hash', )