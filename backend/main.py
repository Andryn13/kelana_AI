from fastapi import FastAPI
from pydantic import BaseModel

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category
)

app = FastAPI()


class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str

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

    transportation = {
    "backpacker": "Bus",
    "family": "Train",
    "business": "Flight",
    "luxury": "Flight"
}

    recommended_transport = transportation.get(
        request.travel_style.lower(),
        "Train"
    )

    return {
        "destination": request.destination,
        "days": request.days,
        "budget": request.budget,
        "daily_budget": daily_budget,
        "category": category,
        "recommended_transport": recommended_transport
    }

@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]