HttpClient client = HttpClient.newHttpClient();

HttpRequest request =
    HttpRequest.newBuilder()
        .uri(
            URI.create(
                "https://api.chucknorris.io/jokes/random"
            )
        )
        .build();

HttpResponse<String> response =
    client.send(
        request,
        HttpResponse.BodyHandlers.ofString()
    );

assert response.statusCode() == 200;