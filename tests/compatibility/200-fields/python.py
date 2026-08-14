import requests

response = requests.get(
    "https://api.chucknorris.io/jokes/random"
)

assert response.status_code == 200

body = response.json()

assert "id" in body
assert "value" in body
assert "icon_url" in body
assert "url" in body

assert isinstance(body["id"], str)
assert isinstance(body["value"], str)