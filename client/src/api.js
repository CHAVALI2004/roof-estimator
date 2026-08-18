const API_URL = "https://roof-estimator-backend-wl3z.onrender.com/api";

export async function getConfig() {
  const response = await fetch(`${API_URL}/config`);

  if (!response.ok) {
    throw new Error("Failed to load configuration");
  }

  return response.json();
}

export async function submitEstimate(data) {
  const response = await fetch(`${API_URL}/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to generate estimate");
  }

  return result;
}