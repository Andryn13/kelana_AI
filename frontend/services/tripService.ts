const API_URL = "http://127.0.0.1:8000/api/v1";

export async function getTrips() {
  const response = await fetch(`${API_URL}/trips`);

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
}

export async function getTrip() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/trips`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
}

export async function createTrip(data: {
  destination: string;
  days: number;
  budget: number;
  travel_style: string;
}) {
  const response = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create trip");
  }

  return response.json();
}

export async function generateTrip(id: number) {
  const response = await fetch(`${API_URL}/trips/${id}/generate`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to generate trip");
  }

  return response.json();
}