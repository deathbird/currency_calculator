/*
 Application entry file.
 */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Calculator from './components/Calculator.jsx'
import CurrenciesTable from './components/CurrenciesTable.jsx'
import RatesTable from './components/RatesTable.jsx'

import {log} from "./utils"

log('Ini from React', 'Hello from react!!!')

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

log('curr', currencies)
log('rates', rates)
log('currencyInsertRoute', currencyInsertRoute)

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

    handleCurrencyChange(currencies) {
        log('handleCurrencyChange', currencies)
        this.setState({currencies: currencies})
    }

    handleRatesChange(rates) {
        log('handleRatesChange', rates)
        this.setState({rates: rates})
    }

    render() {
        return (
            <div>
                <Calculator
                    currencies={this.state.currencies}
                    rates={this.state.rates}
                />
                <CurrenciesTable
                    currencies={currencies}
                    insertRoute={currencyInsertRoute}
                    onCurrencyChange={this.handleCurrencyChange}
                />
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

