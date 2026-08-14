curl -i https://api.chucknorris.io/jokes/random

#validation, true expected:

curl -s https://api.chucknorris.io/jokes/random \
| jq '

has("id") and
has("value") and
has("icon_url") and
has("url")

'