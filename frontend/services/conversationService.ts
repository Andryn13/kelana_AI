const API_URL = "http://127.0.0.1:8000/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createConversation() {
  const response = await fetch(
    `${API_URL}/conversations`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create conversation");
  }

  return response.json();
}

export async function getConversations() {
  const response = await fetch(
    `${API_URL}/conversations`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return response.json();
}

export async function getMessages(conversationId: number) {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json();
}

export async function sendMessage(
  conversationId: number,
  content: string
) {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        content,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}