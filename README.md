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

The environment where the application was tested was an Ubuntu 18.04 computer with PHP 7.2 installed. Also was tested in a Windows desktop (see 4. below).

1.First clone the repo:
```bash
git clone https://github.com/deathbird/currency_calculator.git
```

2.Then cd into the repo directory:
```bash
cd currency_calculator
```

3.You will need composer to install all dependencies:
```bash
composer install
```

4.Start the local Symfony web server. By default the web server runs in port 8000:
```bash
bin/console server:start
```

On Windows machines if the 'server:start' command is problematic try:
```bash
bin/console server:run
```

5.Finally open to use the application in a web browser:

[http://localhost:8000/](http://localhost:8000/)
