/**
 * This file contains functions that deal with urls
 */

//url space_encoding
const space_encoding = "%20";
const categories = ["Cleanser", "Toner", "Serum"];

/**
 * Assumes that the product_name is valid (only uppercase, lowercase)
 * Format is: Word1 Word2 Word3 -> Word1%20Word2%20Word3
 * @param {string} product_name
 * @returns url query that is based off of product_name input
 */

//write a function that takes in a product name and turns it into a url
function getUrl(product_name) {
  let base_string = "";
  let split_product_name = product_name.split(" ");

  for (let i = 0; i < split_product_name.length; i++) {
    base_string += space_encoding + split_product_name[i];
  }

  let res = base_string.slice(3); //gets rid of the first %20

  return res;
}

function findCategoryFromUrl(url) {
  let category = "";
  for (let i = 0; i < categories.length; i++) {
    if (url.includes(categories[i].toLowerCase())) {
      category = categories[i];
    }
  }
  if (category == "") {
    category = "Not Found";
  }
  return category;
}

function stringSimilarity(str1, str2) {
  //measure how similar each string is to each other --

  //one way is to count the number of words in common and then divide by the length longer word
  let str1_length = str1.length;
  let str2_length = str2.length;

  let str1_arr = str1.split(" ");
  let str2_arr = str2.split(" ");

  //   console.log(str1_arr);
  //   console.log(str2_arr);

  //console.log(str1_arr.length);
  //console.log(str2_arr.length);
  //represent the sentences as dictionaries
  let str1_dict = {};
  for (let i = 0; i < str1_arr.length; i++) {
    if (str1_arr[i] in str1_dict) {
      str1_dict[str1_arr[i]] += 1;
    } else {
      str1_dict[str1_arr[i]] = 1;
    }
  }
  //console.log(str1_dict);

  let str2_dict = {};
  for (let i = 0; i < str2_arr.length; i++) {
    if (str2_arr[i] in str2_dict) {
      str2_dict[str2_arr[i]] += 1;
    } else {
      str2_dict[str2_arr[i]] = 1;
    }
  }
  //console.log(str2_dict);
  counter = 0;

  for (let key in str1_dict) {
    if (key in str2_dict) {
      counter += Math.min(str2_dict[key], str1_dict[key]);
    }
  }

  return counter / Math.max(str1_length, str2_length);
}

module.exports = {
  getUrl: getUrl,
  findCategory: findCategoryFromUrl,
  getSimilarity: stringSimilarity,
};
