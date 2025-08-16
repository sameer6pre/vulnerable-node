var config = require("../config"),
    pgp = require('pg-promise')(),
    db = pgp(config.db.connectionString);

function list_products() {
    
    var q = "SELECT * FROM products;";

    return db.many(q);
}

function getProduct(product_id) {
    // FIX: Use parameterized queries to prevent SQL injection
    const q = "SELECT * FROM products WHERE id = $1;";
    return db.one(q, [product_id]);
}
// This fix uses a parameterized query (with $1 as a placeholder) and passes the user input as a separate parameter array to the database driver. This ensures that the input is properly escaped and cannot alter the structure of the SQL statement, fully mitigating SQL injection risks.

function search(query) {

    var q = "SELECT * FROM products WHERE name ILIKE '%" + query + "%' OR description ILIKE '%" + query + "%';";

    return db.many(q);

}

function purchase(cart) {

    var q = "INSERT INTO purchases(mail, product_name, user_name, product_id, address, phone, ship_date, price) VALUES('" +
            cart.mail + "', '" +
            cart.product_name + "', '" +
            cart.username + "', '" +
            cart.product_id + "', '" +
            cart.address + "', '" +
            cart.ship_date + "', '" +
            cart.phone + "', '" +
            cart.price +
            "');";

    return db.one(q);

}

function get_purcharsed(username) {

    var q = "SELECT * FROM purchases WHERE user_name = '" + username + "';";

    return db.many(q);

}

var actions = {
    "list": list_products,
    "getProduct": getProduct,
    "search": search,
    "purchase": purchase,
    "getPurchased": get_purcharsed
}

module.exports = actions;
