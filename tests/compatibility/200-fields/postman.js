pm.test("Status code", () => {
    pm.response.to.have.status(200);
});

const body = pm.response.json();

pm.test("Required fields", () => {

    [
        "id",
        "value",
        "icon_url",
        "url"
    ].forEach(field => {

        pm.expect(body).to.have.property(field);

    });

});

pm.test("Types", () => {

    pm.expect(body.id).to.be.a("string");
    pm.expect(body.value).to.be.a("string");
    pm.expect(body.icon_url).to.be.a("string");
    pm.expect(body.url).to.be.a("string");

});