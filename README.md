# Partner Vault

## Introduction

Partner Vault is a Tauri-based application developed for the FBLA coding and programming 2023-24 competition. Designed for school, it stores data about business partners, sponsors, etc.

## Features

- **Supabase Integration:** Supabase is utilized as the backend for the application.
- **Tags:** Organize partner information with tags.
- **Partners:** Partner data contains a name, type, contacts, and a relationship to tags.
- **Searching and Filtering:** Easily search for partners using tags, names, and partner types.
- **Report Generation:** Generate reports using Supabase edge functions.
- **Cross-Platform Compatibility:** Runs on multiple operating systems.

## Installation

### Using Releases

1. Visit the [releases page](https://github.com/oglassdev/partner-vault-v2/releases) of the Partner Vault repository.
2. Download the latest release for your operating system.
3. Run the application!

### Building from Source

#### Prerequisites

- Node.js (v14 or later)
- Rust (latest stable version)
- A package manager (npm or yarn)

#### Steps

1. Clone the repository:
   ```
   git clone https://github.com/oglassdev/partner-vault-v2.git
   ```
2. Navigate to the project directory:
   ```
   cd partnervault
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Build the application:
   ```
   npm run tauri build
   ```

## Usage

1. **Add/Edit Partner Information:** Easily manage partner details.
2. **Utilize Tags:** Organize information using tags for efficient categorization.
3. **Generate Reports:** Create detailed reports from stored data.
4. **Search for Partners:** Quickly find partners using the search feature.

## Important Note

Partner Vault is specifically designed to work with a predefined Supabase instance and is not compatible with other instances, unless the format is the same.

## Contributing

If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a Pull Request.

## License

[GPL License](LICENSE.txt)