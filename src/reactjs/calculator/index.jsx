/**
 Application entry file.
 */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Calculator from './components/Calculator.jsx'
import CurrenciesTable from './components/CurrenciesTable.jsx'
import RatesTable from './components/RatesTable.jsx'

import {log} from "./utils"

// log('Ini from React', 'Hello from react!!!')

const
    elem = document.getElementById('calculator'),
    ds = elem.dataset,
    currenciesUnsorted = JSON.parse(ds.currencies),
    rates = JSON.parse(ds.rates),
    currencyInsertRoute = ds.currencyInsertRoute,
    ratesInsertRoute = ds.ratesInsertRoute,
    ratesEditRoute = ds.ratesEditRoute

// sort currencies
let currencies = {};
Object.keys(currenciesUnsorted).sort().forEach( key => currencies[key] = currenciesUnsorted[key])

// log('curr', currencies)
// log('rates', rates)
// log('currencyInsertRoute', currencyInsertRoute)

/**
 * Root component class. Uses handleRatesChange, handleCurrencyChange to be
 * notified by child components of currencies and rates changes and consequently
 * to re-render.
 * Comprises of 3 child components: Calculator, CurrenciesTable and RatesTable.
 */
class CalculatorRoot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rates: props.rates,
            currencies: props.currencies
        }
        this.handleRatesChange = this.handleRatesChange.bind(this)
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this)
    }

    /**
     * Function that subscribes to CurrenciesTable component to be notified when
     * a currency is added.
     */
    handleCurrencyChange(currencies) {
        // log('handleCurrencyChange', currencies)
        this.setState({currencies: currencies})
    }

    /**
     * Function that subscribes to RatesTable component to be notified when
     * a rate is added or updated.
     */
    handleRatesChange(rates) {
        // log('handleRatesChange', rates)
        this.setState({rates: rates})
    }

    render() {
        return (
            <div>
                {/* Calculator functionality */}
                <Calculator
                    currencies={this.state.currencies}
                    rates={this.state.rates}
                />
                {/* Currencies listing and insert functionality */}
                <CurrenciesTable
                    currencies={currencies}
                    insertRoute={currencyInsertRoute}
                    onCurrencyChange={this.handleCurrencyChange}
                />
                {/* Rates listing and insert/update functionality */}
                <RatesTable
                    currencies={this.state.currencies}
                    rates={rates}
                    insertRoute={ratesInsertRoute}
                    updateRoute={ratesEditRoute}
                    onRatesChange={this.handleRatesChange}
                />
            </div>
        )
    }
}


elem && ReactDOM.render(
<CalculatorRoot
    currencies={currencies}
    rates={rates}
/>,
    elem
);

