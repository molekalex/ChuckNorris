const axios = require("axios");

(async () => {

    const response = await axios.get(
        "https://api.chucknorris.io/jokes/random"
    );

    console.assert(response.status === 200);

    console.assert(response.data.id);
    console.assert(response.data.value);
    console.assert(response.data.icon_url);
    console.assert(response.data.url);

})();