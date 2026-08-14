import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

given()

.when()

.get("https://api.chucknorris.io/jokes/random")

.then()

.statusCode(200)

.body("id", notNullValue())
.body("value", notNullValue())
.body("icon_url", notNullValue())
.body("url", notNullValue());