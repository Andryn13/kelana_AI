import bcrypt
from jose import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

from database import SessionLocal
from models.trip import User
import os

load_dotenv()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        bytes(password, encoding="utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


def register(name, email, password):
    db = SessionLocal()

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()

    return user


SECRET_KEY = os.getenv("SECRET_KEY")

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    db = SessionLocal()

    user = db.query(User).filter(
        User.id == int(user_id)
    ).first()

    db.close()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


def login(email, password):
    db = SessionLocal()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user.password_hash.encode("utf-8")
    ):
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = jwt.encode(
        {"sub": str(user.id)},
        SECRET_KEY,
        algorithm="HS256"
    )

    db.close()

    return {
        "access_token": token,
        "token_type": "bearer"
    }