# Symfony-React RESTful Boilerplate

A boilerplate with two separated applications: RESTful API (created through the Symfony 4 PHP framework) and SPA (the React JavaScript library respectively).
It contains a user implementation with advanced functions suitable for most projects. The following features are included:

- JWT authentication
- Registration
- Account management
- Confirmation via email (password reset, account activation, email change)
- Administrative interface

The main components of the Symfony part:

- Annotations (FrameworkExtraBundle)
- Doctrine
- Doctrine Migrations

The main components of the React part:

- Webpack
- Babel (ES6+ and JSX)
- Hot Module Replacement
- Flow
- ESLint
- Redux
- Bootstrap 4

## Installation

### Symfony

1. Install application dependencies:
```bash
composer install
```
2. Configure parameters in the `config/packages/doctrine.yaml` and `.env` files according to your needs.
3. Generate secret keys for JWT:
```bash
php bin/console lexik:jwt:generate-keypair
```
4. Create the database:
```bash
php bin/console doctrine:database:create
```
5. Create the schema migration and migrate it:
```bash
php bin/console doctrine:migrations:diff
php bin/console doctrine:migrations:migrate
```
6. Create a super administrator:
```bash
php bin/console app:create-super-admin email@example.com password
```

### React

1. Install application dependencies:
```bash
yarn install
```
2. Generate library definitions for dependencies (use this command when you add new third-party libraries into your code):
```bash
yarn run flow-typed install
```
3. Change URLs in the `src/constants/callConstants.js` file on your own way.
4. Run the application in a development mode:
```bash
yarn run start
```

## Commands

### Symfony

- `php bin/console list` - lists all available commands

### React

- `yarn run start` - starts a development server that provides live reloading
- `yarn run build` - launches a build process for a production
- `yarn run flow` - runs the Flow library
- `yarn run lint` - runs the ESLint library
