/**
 * This file contains functions that deal with urls
 */

//url space_encoding
const space_encoding = "%20";

/**
 * Assumes that the product_name is valid (only uppercase, lowercase)
 * Format is: Word1 Word2 Word3 -> Word1%20Word2%20Word3
 * @param {string} product_name
 * @returns url query that is based off of product_name input
 */

//write a function that takes in a product name and turns it into a url
function getUrl(product_name) {
  let base_string = "";
  let split_product_name = product_name.split();

  for (let i = 0; i < split_product_name.length; i++) {
    base_string += space_encoding + split_product_name[i];
  }

  let res = base_string.slice(3); //gets rid of the first %20

  return res;
}

module.exports = {
  getUrl: getUrl,
};
