from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_travel_season,
    get_recommended_places
)

def print_destinations(destinations):
    if len(destinations) == 1:
        print(f"Destination     : {destinations[0]}")
    else:
        print("Destinations    :")
    
    for destination in destinations:
        print(f"- {destination}")
    print()

def print_recommended_places(destinations):
    print("Recommended Places")

    
    for destination in destinations:
        print(destination)

        for place in get_recommended_places(destination):
            print(f"- {place}")
        print()

def print_trip_summary(destinations, days, budget, month):
    daily_budget = calculate_daily_budget(budget, days)
    category = get_trip_category(budget)
    season = get_travel_season(month)

    print("==================================")
    print("KelanaAI")
    print("==================================")
    print()
    print_destinations(destinations)
    print(f"Days            : {days}")
    print(f"Budget          : {budget:g} USD")
    print(f"Category        : {category}")
    print(f"Daily Budget    : {daily_budget:g} USD/Day")
    print(f"Travel Month    : {month}")
    print(f"Season          : {season}")
    print()
    print_recommended_places(destinations)



# Get trip information from the user
destinations = []

while True:
    destination = input("Enter a destination (or type 'selesai' to finish): ")

    if destination.lower().strip() == "selesai":
        break

    if destination.strip():
        destinations.append(destination.strip())


days = int(input("Days: "))
budget = float(input("Budget: "))
travel_month = input("Travel Month: ")

print_trip_summary(destinations, days, budget, travel_month)