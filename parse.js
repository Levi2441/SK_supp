/**
 * The purpose of this file is to experiment
 * with the cheerio library
 */
const cheerio = require("cheerio");
const axios = require("axios");

const { getUrl, findCategory } = require("./url.js");

const base_url = "https://www.ewg.org/skindeep/search/?search=";
const categories = ["Cleanser", "Toner", "Serum"];

//say product is the name of product that user suggested
const product = "Hydrating Toner";

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

    //we want the element link
    let link = best_element.find("a");
    let name = best_element.find("div.product-name").text();
    let company = best_element.find("div.product-company").text();

    // console.log(name);
    // console.log(company);

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

async function get_product_info(product_url) {
  try {
    const prod_res = await axios.get(product_url);
    const new_doc = cheerio.load(prod_res.data);

    //finds the name of the product
    let name_of_product = new_doc("div.product-score-name-wrapper")
      .children()
      .eq(1)
      .text();
    console.log(name_of_product);

    //finds the brand of the product
    let brand_of_product = new_doc("div.product-lower")
      .children()
      .eq(5)
      .text()
      .trim();
    console.log(brand_of_product);

    //next few lines finds the category of the product
    let helper_category = new_doc("div.product-lower").children();

    //gives you a link with the category in it -- check which one is in -> default to cleanser
    let category_link = helper_category.eq(2).attr("href");

    //
    let category = findCategory(category_link);
    console.log(category);

    //finds the img element with classname squircle and returns value of "alt" attribute
    let overall_score = new_doc("img.squircle").attr("alt");

    //we need to parse the string overall_score

    //now we get information from the ingredients
    let ingredients_table = new_doc("tbody").children("tr");

    //going to assume that ingredients table contains all the tr elements
    console.log(overall_score.trim());

    index = 0;
    while (index < ingredients_table.length) {
      let first_ingredient = ingredients_table.eq(index);
      let first_ing_name = first_ingredient.find("div.td-ingredient-interior");
      let first_ing_score = first_ingredient.find("img").attr("alt");

      if (first_ing_score === undefined) {
        //break when you start getting undefined values
        break;
      }
      console.log(first_ing_name.text().trim());
      console.log(first_ing_score);

      index += 2;
    }
  } catch (error) {
    console.log(error);
  }
}

async function execute() {
  let product_page_url = await get_product_url(query_url);

  //console.log(product_page_url);
  get_product_info(product_page_url);
}

execute();
