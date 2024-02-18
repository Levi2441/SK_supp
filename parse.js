/**
 * The purpose of this file is to experiment
 * with the cheerio library
 */
const cheerio = require("cheerio");
const axios = require("axios");

const { getUrl, findCategory, getSimilarity } = require("./url.js");

// const base_url = "https://www.ewg.org/skindeep/search/?search=";
// const product = "Propolis Toner";
// const query_url = base_url + getUrl(product);

const categories = ["Cleanser", "Toner", "Serum"];

//say product is the name of product that user suggested

//we would have to check create the url to query with the product_name
//combining product name and base_url to get GET query

async function get_product_url(product, combined_url) {
  try {
    //console.log(combined_url);
    const get_response = await axios.get(combined_url);
    const doc = cheerio.load(get_response.data);
    //console.log(doc);

    //traverse down the DOM to get the product listings of the result of our query
    let text = doc("section.product-listings").children("div");
    //console.log(text);

    //check if there are no product listings
    if (text.length < 1) {
      throw new Error("This is an example of throwing an exception.");
    }

    //get the element that matches the query the most -- no matches then err
    let index = 0;
    let max_index = 0;
    let max_similarity = 0;
    let best_element = text.eq(0);
    //console.log(best_element);
    while (index < text.length) {
      let curr_element = text.eq(index);
      let curr_element_name = curr_element
        .find("div.product-name")
        .text()
        .trim();

      //console.log("We get here");
      let curr_similarity = getSimilarity(product.trim(), curr_element_name);

      //console.log("We get here");
      if (curr_similarity > max_similarity) {
        max_index = index;
        max_similarity = curr_similarity;
        best_element = curr_element;
      }
      index += 1;
    }
    //console.log(max_index);

    //console.log(max_similarity);
    //check for the case where we found no similarity
    if (max_similarity == 0) {
      //console.log(text.length);
      throw new Error("This is an example of throwing an exception.");
    }

    //

    //let best_element = text.eq(0); //gets the first object

    //we want the element link
    let link = best_element.find("a");
    // let name = best_element.find("div.product-name").text();
    // let company = best_element.find("div.product-company").text();

    // console.log(name);
    // console.log(company);

    //parse this text to see if there are results that match our desired product

    //get the one that most matches

    //returns value of that attribute
    //console.log(link.attr("href"));

    //return the link for the product
    return link.attr("href");
  } catch (error) {
    //console.log(error);
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
      .text()
      .trim();
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
    let category_of_product = findCategory(category_link);
    // console.log("Hello");
    // console.log(category_of_product);

    //finds the img element with classname squircle and returns value of "alt" attribute
    // console.log("Hello:");
    let overall_score;
    try {
      overall_score = new_doc("img.squircle").attr("alt").toString().slice(14);
    } catch {
      overall_score = "-1";
    }

    //console.log(overall_score);
    //console.log("Hello:");

    let overall_score_int;
    if (typeof overall_score == "string") {
      overall_score_int = parseInt(overall_score, 10);
    }
    // console.log("Hello:");
    //we need to parse the string overall_score

    //now we get information from the ingredients
    // console.log("Hello");
    let ingredients_table = new_doc("tbody").children("tr");
    // console.log("Hello:");
    //going to assume that ingredients table contains all the tr elements
    //console.log(overall_score.trim());

    let ingredients_of_product = [];

    index = 0;
    while (index < ingredients_table.length) {
      let first_ingredient = ingredients_table.eq(index);
      let first_ing_name = first_ingredient.find("div.td-ingredient-interior");
      let first_ing_score = first_ingredient.find("img").attr("alt");

      if (first_ing_score === undefined) {
        //break when you start getting undefined values
        break;
      }
      ingredients_of_product.push(first_ing_name.text().trim());
      //   console.log(first_ing_name.text().trim());
      //   console.log(first_ing_score);

      index += 2;
    }
    // console.log(ingredients_of_product);
    return {
      product_name: name_of_product,
      product_brand: brand_of_product,
      product_category: category_of_product,
      overall_score: overall_score_int,
      product_ingredients: ingredients_of_product,
    };
  } catch (error) {
    //console.log("dang");
  }
}

async function execute(product, url) {
  //either throw an error or return a product url
  //console.log(url);
  let product_page_url = await get_product_url(product, url);

  console.log(product_page_url);
  //either throw an error or return a product object
  let res = await get_product_info(product_page_url);
  console.log(res);
  return res;
}

//execute(query_url);

module.exports = {
  returnInformation: execute,
};
