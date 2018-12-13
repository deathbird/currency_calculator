/**
 * Calculator functionality component
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ROUND_DECIMALS } from "../constants"

import {log, round} from "../utils"

class Calculator extends Component {
    constructor(props) {
        super(props)
        const defaultBaseValue = 1
        const firstBaseCurrency = 'EUR'  //Object.keys(props.currencies)[0]
        const firstTargetCurrency = this.getFirstTargetCurrency(firstBaseCurrency, props.rates)
        this.state = {
            baseCurrency: firstBaseCurrency,
            targetCurrency: firstTargetCurrency,
            baseValue: defaultBaseValue,
            targetValue: defaultBaseValue * props.rates[firstBaseCurrency].rates[firstTargetCurrency]
        }
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.calculateBase = this.calculateBase.bind(this)
        this.calculateTarget = this.calculateTarget.bind(this)
    }

    /**
     * Retrieve first target currency (code) for given base currency code.
     *
     * @param baseCurrency
     * @param rates
     * @returns {string}
     */
    getFirstTargetCurrency(baseCurrency, rates) {
        const targetRates = rates[baseCurrency].rates
        return Object.keys(targetRates)[0]
    }

    /**
     * When a currency is selected.
     *
     * @param e
     */
    handleCurrencyChange(e) {
        e.preventDefault()
        // log('change', e.target.name, e.target.value)
        this.setState({[e.target.name]: e.target.value})
        if (e.target.name === 'baseCurrency') {
            // if a base currency is selected then select the first target
            // currency and calculate the rate.
            const targetCurrency = this.getFirstTargetCurrency(e.target.value, this.props.rates)
            this.setState({targetCurrency: targetCurrency})
            this.calculateTarget(e.target.value, targetCurrency, this.state.baseValue)
        } else {
            this.calculateTarget(this.state.baseCurrency, e.target.value, this.state.baseValue)
        }
    }

    /**
     * When a rate is changed calculate the opposite rate.
     *
     * @param e
     */
    handleValueChange(e) {
        e.preventDefault()
        this.setState({[e.target.name]: e.target.value})
        if (e.target.name === 'baseValue') {
            this.calculateTarget(this.state.baseCurrency, this.state.targetCurrency, e.target.value)
        } else if (e.target.name === 'targetValue') {
            this.calculateBase(this.state.baseCurrency, this.state.targetCurrency, e.target.value)
        }
    }

    /**
     * Calculate base currency ratio based on a target currency rate.
     *
     * @param baseCurrency
     * @param targetCurrency
     * @param fromValue
     */
    calculateBase(baseCurrency, targetCurrency, fromValue) {
        const value = round(fromValue / this.props.rates[baseCurrency].rates[targetCurrency], ROUND_DECIMALS)
        // log('calculateBase', fromValue, value, 'base', baseCurrency, 'target', targetCurrency, this.props.rates)
        this.setState({baseValue: value})
    }

    /**
     * Calculate target currency ratio based on a base currency rate.
     * @param baseCurrency
     * @param targetCurrency
     * @param fromValue
     */
    calculateTarget(baseCurrency, targetCurrency, fromValue) {
        const value = round(fromValue * this.props.rates[baseCurrency].rates[targetCurrency], ROUND_DECIMALS)
        // log('calculateTarget', fromValue, value, 'base', baseCurrency, 'target', targetCurrency, this.props.rates)
        this.setState({targetValue: value})
    }

    render() {
        const {rates, currencies} = this.props
        const baseCurrencies = Object.keys(rates).map((currKey) => {
            return <option key={currKey} value={currKey}>{currencies[currKey]}</option>
        })
        const targetRates = rates[this.state.baseCurrency].rates
        const targetCurrencies = Object.keys(targetRates).map((currKey) => {
            return <option key={currKey} value={currKey}>{currencies[currKey]}</option>
        })

        return (
            <div className="tile is-ancestor">
                <div className="tile is-3">
                </div>
                <div className="tile box">
                    <div className="tile is-child">
                        <p className="subtitle">Currency Calculator</p>
                        <div className="field is-horizontal is-grouped">
                            <div className="field-label is-normal">
                                <label className="label">Base Currency</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control is-expanded">
                                        <div className="select is-fullwidth">
                                            <select
                                                name="baseCurrency"
                                                value={this.state.baseCurrency}
                                                onChange={this.handleCurrencyChange}>
                                                {baseCurrencies}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input"
                                            name="baseValue"
                                            type="number"
                                            value={this.state.baseValue}
                                            step="0.0001"
                                            onChange={this.handleValueChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field is-horizontal is-grouped">
                            <div className="field-label is-normal">
                                <label className="label">Target Currency</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <div className="control is-expanded">
                                        <div className="select is-fullwidth">
                                            <select
                                                name="targetCurrency"
                                                value={this.state.targetCurrency}
                                                onChange={this.handleCurrencyChange}>
                                                {targetCurrencies}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input"
                                            name="targetValue"
                                            type="number"
                                            value={this.state.targetValue}
                                            step="0.0001"
                                            onChange={this.handleValueChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tile is-3">
                </div>
            </div>
        )
    }
}


export default Calculator
