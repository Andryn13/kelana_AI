def calculate_daily_budget(budget, days):
    #aritmethic operations: - +  x /
    return budget/days

def get_trip_category(budget):
    if budget < 1000:
        return "Backpacker"
    elif budget <= 3000:
        return "Standard"
    else:
        return "Luxury"

daily = calculate_daily_budget(1500,5)
category = get_trip_category(1500)
print(f"{category} - {daily} USD/day")

def get_transportation_recommendation(category):
    if category.lower() == "backpacker":
        return "Bus"
    elif category.lower() == "standard":
        return "Train"
    else:
        return "Flight"

def get_recommended_places(destination):
    recommendations = {
        "Japan": ["Tokyo Tower", "Shibuya", "Mount Fuji"],
        "Bali": ["Ubud", "Kuta Beach", "Tanah Lot"],
        "Singapore": ["Marina Bay Sands", "Gardens by the Bay", "Sentosa"]

    }
    return recommendations.get(destination, ["City Center", "Local Market", "Popular Landmark"])