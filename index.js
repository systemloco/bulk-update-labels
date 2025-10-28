const dotenv = require('dotenv');
const fs = require('fs').promises;
const getArgs = require('./GetArgs');

dotenv.config();

const LOCOAWARE_API_ENDPOINT = 'https://locoaware.com/api/device/{id}/label';

/**
 * Creates headers for the LocoAware API request
 * @param {string} apiKey - The LocoAware API key
 * @returns {Headers} Configured headers object
 */
function createHeaders(apiKey) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Bearer ${apiKey}`);
    return headers;
}

/**
 * Updates a label for a single device
 * @param {string} deviceId - The device ID
 * @param {string} labelName - The label to add or remove
 * @param {boolean} isRemoveMode - Whether to remove the label
 * @param {string} apiKey - The LocoAware API key
 * @returns {Promise} Fetch promise for the API request
 */
function updateDeviceLabel(deviceId, labelName, isRemoveMode, apiKey) {
    const url = LOCOAWARE_API_ENDPOINT.replace('{id}', deviceId);
    const headers = createHeaders(apiKey);

    const requestOptions = {
        method: isRemoveMode ? 'DELETE' : 'POST',
        headers: headers,
        body: JSON.stringify({ label: labelName }),
        redirect: 'follow'
    };

    return fetch(url, requestOptions);
}

/**
 * Reads device IDs from a CSV file
 * @param {string} filePath - Path to the CSV file
 * @returns {Promise<string[]>} Array of device IDs
 */
async function readDeviceIds(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const lines = data.split('\n');
        return lines.map(line => line.trim()).filter(line => line.length > 0);
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        throw error;
    }
}

/**
 * Main function to bulk update labels
 */
async function main() {
    // Parse command line arguments
    const { success, values } = getArgs();
    if (!success) {
        process.exit(1);
    }

    const { csvFile, labelName, isRemoveMode } = values;

    // Validate API key
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error('Error: API_KEY environment variable is not set');
        console.error('Please create a .env file with your LocoAware API key');
        process.exit(1);
    }

    // Display operation details
    console.log('═'.repeat(50));
    console.log(`CSV File: ${csvFile}`);
    console.log(`Label: ${labelName}`);
    console.log(`Operation: ${isRemoveMode ? 'REMOVE' : 'ADD'}`);
    console.log(`API Key: ${apiKey.substring(0, 8)}...`);
    console.log('═'.repeat(50));

    try {
        // Read device IDs from CSV
        const deviceIds = await readDeviceIds(csvFile);
        console.log(`\nProcessing ${deviceIds.length} device(s)...\n`);

        // Create API requests for all devices
        const requests = deviceIds.map(id =>
            updateDeviceLabel(id, labelName, isRemoveMode, apiKey)
        );

        // Execute all requests in parallel
        const responses = await Promise.all(requests);

        // Process responses
        let successCount = 0;
        let failureCount = 0;

        for (let i = 0; i < responses.length; i++) {
            const response = responses[i];
            const deviceId = deviceIds[i];

            if (response.ok) {
                successCount++;
                console.log(`✓ Device ${deviceId}: Success`);
            } else {
                failureCount++;
                const errorText = await response.text();
                console.error(`✗ Device ${deviceId}: Failed (${response.status}) - ${errorText}`);
            }
        }

        // Summary
        console.log('\n' + '═'.repeat(50));
        console.log(`Total: ${deviceIds.length} | Success: ${successCount} | Failed: ${failureCount}`);
        console.log('═'.repeat(50));

        if (failureCount > 0) {
            process.exit(1);
        }
    } catch (error) {
        console.error(`\nError: ${error.message}`);
        process.exit(1);
    }
}

// Run the main function
main();


