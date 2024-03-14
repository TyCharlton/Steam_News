#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from faker import Faker

# Local imports
from config import app, db
from models import User

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Generate and insert fake user data
        for _ in range(10):
            user = User(
                name=fake.name(),
                username=fake.user_name(),
                _password_hash=fake.password(),
            )
            db.session.add(user)

        db.session.commit()

        print("Seed completed!")
