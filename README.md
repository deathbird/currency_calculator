Rates Currency Calculator 
=========================

A sample mini-project / SPA webapp to implement a rates currency calculator using:

* [Symfony](https://symfony.com/) 4 PHP framework.
* [React](https://reactjs.org/) Javascript library for building the app UI.
* [Bulma](https://bulma.io/) CSS framework.

## Features

The web app comprises of 3 areas:
* A rates currency calculator
* A listing of supported currencies with a form to add new currencies
* A listing of supported exchange rates with a form to new rates but also ability to edit/update existing rates.

To keep the application simple the following where choises were made:
* A single Symfony Controller class to handle all requests.
* The currencies and rates displayed are persisted in the session using 2 service classes.

## Installation

First clone the repo:
```bash
git clone https://github.com/deathbird/currency_calculator.git
```

Then cd into the repo directory:
```bash
cd currency_calculator
```

You will need composer to install all dependencies:
```bash
composer install
```

Start the local Symfony web server. By default the web server runs in port 8000:
```bash
bin/console server:start
```

Finally open to use the application in a web browser:

[http://localhost:8000/](http://localhost:8000/)
