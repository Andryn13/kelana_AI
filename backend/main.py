from fastapi import FastAPI, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.kb_service import ask_knowledge_base

from services.bedrock_service import generate_recommendation

from models.trip import User, Trip
from services.auth_service import (
    get_current_user,
    register,
    login
)

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_transportation_recommendation
)

from database import SessionLocal, init_db

class QuestionRequest(BaseModel):
    question: str

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


init_db()


@app.get("/")
def home():
    return {
        "message": "Welcome to KelanaAI"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


# =========================
# AUTH
# =========================

@app.post("/api/v1/auth/register")
def register_user(request: RegisterRequest):
    user = register(
        request.name,
        request.email,
        request.password
    )

    return {
        "message": "User registered successfully",
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }


@app.post("/api/v1/auth/login")
def login_user(request: LoginRequest):
    return login(
        request.email,
        request.password
    )


# =========================
# TRIPS
# =========================

@app.post("/api/v1/trips")
def create_trip(
    request: TripRequest,
    user: User = Depends(get_current_user)
):
    daily_budget = calculate_daily_budget(
        request.budget,
        request.days
    )

    category = get_trip_category(
        request.budget
    )

    recommended_transport = get_transportation_recommendation(
        category
    )

    trip = Trip(
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        category=category,
        travel_style=request.travel_style,
        daily_budget=daily_budget,
        user_id=user.id
    )

    db = SessionLocal()

    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "days": trip.days,
        "budget": trip.budget,
        "daily_budget": trip.daily_budget,
        "category": trip.category,
        "recommended_transport": recommended_transport
    }


@app.get("/api/v1/trips")
def list_trip(
    user: User = Depends(get_current_user)
):
    db = SessionLocal()

    trips = db.query(Trip).filter(
        Trip.user_id == user.id
    ).all()

    db.close()

    return trips


@app.get("/api/v1/trips/{trip_id}")
def get_trip(
    trip_id: int,
    user: User = Depends(get_current_user)
):
    db = SessionLocal()

    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == user.id
    ).first()

    db.close()

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    return trip


@app.put("/api/v1/trips/{trip_id}")
def update_trip(
    trip_id: int,
    request: TripRequest,
    user: User = Depends(get_current_user)
):
    db = SessionLocal()

    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == user.id
    ).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    daily_budget = calculate_daily_budget(
        request.budget,
        request.days
    )

    category = get_trip_category(
        request.budget
    )

    trip.destination = request.destination
    trip.days = request.days
    trip.budget = request.budget
    trip.category = category
    trip.travel_style = request.travel_style
    trip.daily_budget = daily_budget

    db.commit()
    db.refresh(trip)
    db.close()

    return trip


@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(
    trip_id: int,
    user: User = Depends(get_current_user)
):
    db = SessionLocal()

    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == user.id
    ).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    db.delete(trip)
    db.commit()
    db.close()

    return {
        "message": f"Trip with id {trip_id} deleted successfully"
    }


# =========================
# RECOMMENDATIONS
# =========================

@app.get("/api/v1/recommendations")
def get_recommendations():
    return [
        "Tokyo Tower",
        "Mount Fuji",
        "Shibuya"
    ]


@app.get("/api/v1/transportations")
def get_transportations():
    return [
        "Bus",
        "Train",
        "Flight"
    ]


@app.post("/api/v1/trips/{trip_id}/generate")
def generate_trip_recommendation(
    trip_id: int,
    user: User = Depends(get_current_user)
):
    db = SessionLocal()

    trip = db.query(Trip).filter(
        Trip.id == trip_id,
        Trip.user_id == user.id
    ).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    prompt = f"""
You are an experienced travel planner.

Create a {trip.days}-day itinerary for {trip.destination}.

Budget: USD {trip.budget}
Travel Style: {trip.category}

For each day, provide a structured daily plan with:

Morning:
- Provide 2-3 specific morning activities.

Afternoon:
- Include cultural sites to visit.
- Include authentic local experiences.

Evening:
- Recommend suitable dinner spots.
- Suggest entertainment or nightlife activities.

Make the itinerary practical, specific, and suitable for the destination and travel style.
"""

    recommendation = generate_recommendation(prompt)

    trip.ai_recommendation = recommendation

    db.commit()
    db.refresh(trip)
    db.close()

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "recommendation": recommendation
    }

@app.post("/api/v1/ask")
def ask_endpoint(request: QuestionRequest):
    answer = ask_knowledge_base(
        request.question
    )

    return {
        "question": request.question,
        "answer": answer
    }