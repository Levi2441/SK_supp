/**
 * The purpose of this file is to experiment
 * with the cheerio library
 */
const cheerio = require("cheerio");
const axios = require("axios");

const { getUrl } = require("./url.js");

const base_url = "https://www.ewg.org/skindeep/search/?search=";

//say product is the name of product that user suggested
const product = "Snail Mucin";

//we would have to check create the url to query with the product_name
//combining product name and base_url to get GET query
const query_url = base_url + getUrl(product);

async function get_product_url(combined_url) {
  try {
    const get_response = await axios.get(combined_url);
    const doc = cheerio.load(get_response.data);

    //traverse down the DOM to get the product listings of the result of our query
    let text = doc("section.product-listings").children("div");

    //get the element that matches the query the most -- no matches then err
    let best_element = text.eq(0); //gets the first object

    //we want the a element
    let link = best_element.find("a");

    //parse this text to see if there are results that match our desired product

    //get the one that most matches

    //returns value of that attribute
    //console.log(link.attr("href"));

    //return the link for the product
    return link.attr("href");
  } catch (error) {
    console.log(error);
  }
}

function get_product_info(product_url) {
  axios
    .get(product_url)
    .then((res) => {
      const new_doc = cheerio.load(res.data);

      //finds the img element with classname squircle and returns value of "alt" attribute
      let overall_score = new_doc("img.squircle").attr("alt");

      //we need to parse the string overall_score

      //now we get information from the ingredients
      let ingredients_table = new_doc("tbody").children("tr");

      //going to assume that ingredients table contains all the tr elements

      let first_ingredient = ingredients_table.eq(0);
      let first_ing_name = first_ingredient.find("div.td-ingredient-interior");
      let first_ing_score = first_ingredient.find("img").attr("alt");

      console.log(overall_score);
      console.log(first_ing_name.text());
      console.log(first_ing_score);

      //console.log(overall_score);
    })
    .catch((err) => console.log(err));
}

async function execute() {
  let product_page_url = await get_product_url(query_url);

  //console.log(product_page_url);
  get_product_info(product_page_url);
}

execute();
