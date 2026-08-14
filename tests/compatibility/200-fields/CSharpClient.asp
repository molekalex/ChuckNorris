using var client = new HttpClient();

var response = await client.GetAsync(
    "https://api.chucknorris.io/jokes/random"
);

response.EnsureSuccessStatusCode();

var json =
    await response.Content.ReadAsStringAsync();

Console.WriteLine(json);