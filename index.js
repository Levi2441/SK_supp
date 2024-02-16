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
