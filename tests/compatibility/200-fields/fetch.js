fetch("https://api.chucknorris.io/jokes/random")

.then(res => {

    console.assert(res.status === 200);

    return res.json();

})

.then(json => {

    console.assert(json.id);
    console.assert(json.value);
    console.assert(json.icon_url);
    console.assert(json.url);

});