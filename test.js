const response = await fetch("http://localhost:11434/api/tags");

if (response.ok) {
  // Parse the response body as JSON
  const responseBody = await response.json();
  console.log(responseBody);
} else {
  console.log("Error fetching tags:", response.statusText);
}
