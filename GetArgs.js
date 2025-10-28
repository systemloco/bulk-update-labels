/**
 * Parses and validates command line arguments
 * @returns {Object} Object containing success status and parsed values
 */
function getArgs() {
    const args = process.argv.slice(2);

    // Validate argument count
    if (args.length < 2 || args.length > 3) {
        console.error('Error: Invalid number of arguments\n');
        console.error('Usage: node index.js <csv-file> <label-name> [remove]\n');
        console.error('Arguments:');
        console.error('  <csv-file>   Path to CSV file containing device IDs (one per line)');
        console.error('  <label-name> Label to add or remove (use quotes if it contains spaces)');
        console.error('  [remove]     Optional flag to remove the label instead of adding it\n');
        console.error('Examples:');
        console.error('  node index.js ids.csv "KN Trial 2"        # Add label');
        console.error('  node index.js ids.csv "KN Trial 2" remove # Remove label');

        return {
            success: false,
            values: null
        };
    }

    const csvFile = args[0];
    const labelName = args[1];
    const isRemoveMode = args[2] === 'remove';

    // Validate remove flag if provided
    if (args.length === 3 && args[2] !== 'remove') {
        console.error(`Error: Invalid third argument "${args[2]}". Expected "remove" or nothing.`);
        return {
            success: false,
            values: null
        };
    }

    return {
        success: true,
        values: {
            csvFile,
            labelName,
            isRemoveMode
        }
    };
}

module.exports = getArgs;
