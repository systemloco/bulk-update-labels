# LocoAware Bulk Label Updater

A command-line tool for bulk adding or removing labels on LocoAware devices.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm
- LocoAware API key with the following permissions:
  - `LIST_DEVICES`
  - `TAG_DEVICE` (Required to add/edit a site reader)

## Getting Your API Key

1. Log in to the [LocoAware platform](https://locoaware.com)
2. Navigate to Admin, Edit Company, API Keys
3. Generate an API key with the required permissions: `LIST_DEVICES` and `TAG_DEVICE`
4. Copy the API key for use in the setup below

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd bulk-update-labels
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Edit the `.env` file and add your LocoAware API key:
```
API_KEY=your_api_key_here
```

## Usage

The tool reads device IDs from a CSV file and adds or removes a specified label from all devices.

### CSV File Format

Create a CSV file with one device ID per line:
```
device-id-1
device-id-2
device-id-3
```

### Adding Labels

To add a label to all devices in the CSV file:

```bash
node index.js <csv-file> <label-name>
```

Example:
```bash
node index.js ids.csv "Customer Trial 1"
```

### Removing Labels

To remove a label from all devices in the CSV file:

```bash
node index.js <csv-file> <label-name> remove
```

Example:
```bash
node index.js ids.csv "Customer Trial 2" remove
```

## Command-Line Arguments

- `<csv-file>`: Path to the CSV file containing device IDs
- `<label-name>`: The label to add or remove (use quotes if it contains spaces)
- `remove` (optional): Include this flag to remove the label instead of adding it

## Example

```bash
# Add label "Production" to all devices in devices.csv
node index.js devices.csv "Production"

# Remove label "Testing" from all devices in devices.csv
node index.js devices.csv "Testing" remove
```

## License

ISC
