from services.trip_services import (calculate_daily_budget, get_trip_category,
    get_transportation_recommendation, get_recommended_places)

def print_dastinations(destinations):
    print("Your Destinations")

    index=0
    while index < len(destinations):
        print(f"{index + 1}. {destinations[index]}")
        index += 1

def print_recommended_places(destinations):
    print("Recommended Places")
    print()

    for destination in destinations:
        print(destination)

        for place in get_recommended_places(destination):
            print(f"- {place}")
        
        print()

def print_trip_summary(destinations, days, budget):
    daily_budget = calculate_daily_budget(budget, days)
    category = get_trip_category(budget)
    transportation = get_transportation_recommendation(category)
    
    print("====================")
    print("KelanaAI")
    print("====================")
    print()
    print_dastinations(destinations)
    print()
    print(f"Days            : {days}")
    print(f"Budget          : {budget} USD")
    print(f'Category        :"{category}"')
    print(f"Daily Budget    : {daily_budget:.0f} USD/day")
    print(f"Recommended Transportation : {transportation}")
    print()
    print_recommended_places(destinations)

print_trip_summary(["Japan", "Korea"], 5, 1500)

destinations = []

while True:
    place = input("Enter a destination (or type 'selesai' to finish): ")
    
    #Check if the user wants to exit
    if place.lower() == 'selesai':
        break #This exist the loop immediately

    destinations.append(place)
    
print("Your full trip itinerary:", destinations)