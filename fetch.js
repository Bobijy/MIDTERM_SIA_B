const axios = require('axios');

// The base URL of your running server
const API_URL = 'http://localhost:19132';

/*
======================================================================
  ACTIVITY 1: BASIC API FETCHING
======================================================================
*/

/**
 * Fetches all users and all products from the API.
 */
async function fetchAllData() {
    console.log('--- [Activity 1: Fetching All Data] ---');
    try {
        // 1. Fetch all users
        const usersResponse = await axios.get(`${API_URL}/users`);
        console.log('Success: Fetched /users');
        console.log('User Data:', usersResponse.data); // Logs data clearly
        console.log('\n'); // Adds a new line for readability

        // 2. Fetch all products
        const productsResponse = await axios.get(`${API_URL}/products`);
        console.log('Success: Fetched /products');
        console.log('Product Data:', productsResponse.data); // Logs data clearly

    } catch (error) {
        console.error('Error in fetchAllData:', error.message);
    }
}

/*
======================================================================
  ACTIVITY 2: DYNAMIC RESOURCE FETCHING
======================================================================
*/

/**
 * Fetches a single user (ID 5) and a single product (ID 1).
 * Also tests error handling for a user that does not exist (ID 999).
 */
async function fetchDynamicData() {
    console.log('\n\n--- [Activity 2: Fetching Dynamic Data] ---');
    
    // 1. Fetch User with ID 5 (Success Case)
    try {
        const userResponse = await axios.get(`${API_URL}/users/5`);
        console.log('Success: Fetched /users/5');
        console.log('Data for User 5:', userResponse.data);
    } catch (error) {
        console.error('Error fetching /users/5:', error.message);
    }

    // 2. Fetch Product with ID 1 (Success Case)
    // (Assuming you have a product with ID 1 in your database)
    try {
        const productResponse = await axios.get(`${API_URL}/products/1`);
        console.log('\nSuccess: Fetched /products/1');
        console.log('Data for Product 1:', productResponse.data);
    } catch (error) {
        // This will run if product 1 doesn't exist
        console.warn('Note: Could not fetch /products/1.', error.message);
    }
    
    // 3. Handle errors gracefully (Invalid ID)
    console.log('\nTesting error handling...');
    try {
        const invalidUser = await axios.get(`${API_URL}/users/999`);
        console.log('Data for User 999:', invalidUser.data);
    } catch (error) {
        // Check if the server sent a 404 error
        if (error.response && error.response.status === 404) {
            console.log('Success: Handled 404 error gracefully.');
            console.log(error.response.data.message); // Should print "User not found"
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
    }
}

/**
 * Main function to run both activities.
 */
async function main() {
    // Make sure your server is running first!
    await fetchAllData();
    await fetchDynamicData();
}

// Run the main function
main();