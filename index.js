/**
 * Right now our goal is to use the "cheerio" library
 * to parse information from a website
 *
 * Our server needs to take in a request containing
 * the name of a product from the frontend, run
 * the logic that we implement, and then, depending on
 * whether it finds it or not, returns a success or failure
 * signal
 *
 * Internally, if we find that it matches, we need to query further for
 * more information to update the original database -- so we need to access the other
 * server API to add a product to the database
 */
const parse = require("./parse.js");
const { getUrl, findCategory, getSimilarity } = require("./url.js");
const cors = require("cors"); //only necessary until backend and frontend run on the same port

const express = require("express");
const app = express();

app.use(cors()); //to allow response from different origin

app.use(express.json()); //allow express methods for parsing json
//say product is the name of product that user suggested

//we would have to check create the url to query with the product_name
//combining product name and base_url to get GET query

async function receive(product) {
  //   let product = "Retinol Serum";
  let base_url = "https://www.ewg.org/skindeep/search/?search=";

  const query_url = base_url + getUrl(product);

  const res = await parse.returnInformation(product, query_url);
  return res;
}

app.get("/", (request, response) => {
  response.send("Send a GET request with name of product");
});

app.post("/product", (request, response) => {
  const data = request.body;
  console.log(data);
  const url = data.url;
  console.log(url);
  receive(url)
    .then((res) => {
      if (res) {
        response.json(res);
      } else {
        response.status(200).json({
          name: "No Products Found",
        });
      }
    })
    .catch((err) => console.log(err));
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//receive();
