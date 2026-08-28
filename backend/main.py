from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.bedrock_service import generate_recommendation

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_transportation_recommendation
)

from database import SessionLocal, init_db
from models.trip import Trip #noqa: F401 -registers Trips with Base.metadata

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str

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

@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(
        request.budget,
        request.days
    )

    category = get_trip_category(request.budget)

    recommended_transport = get_transportation_recommendation(
        category
    )

    # Create a Trip ORM object
    trip = Trip(
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        category=category,
        travel_style=request.travel_style,
        daily_budget=daily_budget
    )

    # Save to PostgreSQL
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
def list_trips():
    db = SessionLocal()
    trips = db.query(Trip).all()
    db.close()
    return trips

@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    db.close()

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    return trip

@app.put("/api/v1/trips/{trip_id}")
def update_trip(trip_id: int, request: TripRequest):
    db = SessionLocal()

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

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

    category = get_trip_category(request.budget)

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
def delete_trip(trip_id: int):
    db = SessionLocal()

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

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



@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]

@app.post("/api/v1/trips/{trip_id}/generate")
def generate_trip_recommendation(trip_id: int):
    db = SessionLocal()

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

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