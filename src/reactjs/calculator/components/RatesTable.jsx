/**
 * RatesTable component
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {log, round} from "../utils"
import {MODE_EDIT, MODE_INSERT, ERRORS_HIDE_TIMEOUT, MESSAGE_FOR_INSERT, MESSAGE_FOR_EDIT, ROUND_DECIMALS} from "../constants"


class RatesTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rates: props.rates,
            baseCurrency: '',
            targetCurrency: '',
            rate: '',
            mode: MODE_INSERT,      // insert mode by default
            message: {
                text:'',
                type:'',
                isError: false
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEditClick = this.handleEditClick.bind(this)
        this.handleResetClick = this.handleResetClick.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.validate = this.validate.bind(this)
        this.insert = this.insert.bind(this)
        this.update = this.update.bind(this)
    }

    getFirstTargetCurrency(baseCurrency, rates) {
        const targetRates = rates[baseCurrency].rates
        return Object.keys(targetRates)[0]
    }

    handleEditClick(e) {
        e.preventDefault()
        const ds = e.target.dataset
        this.setState({
            mode: MODE_EDIT,
            baseCurrency: ds.base,
            targetCurrency: ds.target,
            rate: ds.rate
        })
    }

    handleResetClick(e) {
        e.preventDefault()
        this.setState({
            mode: MODE_INSERT,
            baseCurrency: '',
            targetCurrency: '',
            rate: ''
        })
    }

    handleChange(e) {
        e.preventDefault()
        // log('change', e.target.name, e.target.value)
        this.setState({[e.target.name]: e.target.value})
        if (e.target.name === 'baseCurrency') {
            const targetCurrency = this.getFirstTargetCurrency(e.target.value, this.props.rates)
            this.setState({targetCurrency: targetCurrency})
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        log('submit', e.target.name)
        if (this.state.mode === MODE_INSERT) {
            this.insert()
        } else if (this.state.mode === MODE_EDIT) {
            this.update()
        }
    }

    showMessage({text, type, isError}) {
        this.setState({
            message: {
                text: text,
                type: type,
                isError: isError
            }
        })
        // set a timeout to hide the message
        setTimeout(() => {
            this.setState({
                message: {
                    text: '',
                    type: '',
                    isError: false
                }
            })
        }, ERRORS_HIDE_TIMEOUT)
    }

    validate() {
        return this.state.baseCurrency.length &&
            this.state.targetCurrency.length &&
            this.state.rate.length
    }

    fetchDefaultOptions() {
        return {
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        }
    }

    update() {
        const ok = this.validate()
        if (ok) {  // validation succeded
            // remote call to add Currency
            fetch(
                this.props.updateRoute,
                {
                    ...this.fetchDefaultOptions(),
                    method: 'POST',
                    body: JSON.stringify({
                        base: this.state.baseCurrency,
                        target: this.state.targetCurrency,
                        rate: this.state.rate,
                    })
                }
            ).
            then((res) => res.json()).
            then((data) => {
                // dt = {"result": false, "error": "Manual error response check!"}
                const msg = {
                    text: (!!data.error ? data.error : 'Update successful.'),
                    type: MESSAGE_FOR_EDIT,
                    isError: !!data.error
                }
                this.showMessage(msg)
                this.setState({
                    rates: data.result,
                    baseCurrency: '',
                    targetCurrency: '',
                    rate: '',
                    mode: MODE_INSERT
                })
                this.props.onRatesChange(data.result)
            });
        } else {
            // display validation errors from state.errors
            this.showMessage({
                text: 'All fields should not be empty!',
                type: MESSAGE_FOR_EDIT,
                isError: true
            })
        }
    }

    insert() {
        const ok = this.validate()
        if (ok) {  // validation succeded
            // remote call to add Currency
            fetch(
                this.props.insertRoute,
                {
                    ...this.fetchDefaultOptions(),
                    method: 'POST',
                    body: JSON.stringify({
                        base: this.state.baseCurrency,
                        target: this.state.targetCurrency,
                        rate: this.state.rate,
                    })
                }
            ).
            then((res) => res.json()).
            then((data) => {
                // dt = {"result": false, "error": "Manual error response check!"}
                const msg = {
                    text: (!!data.error ? data.error : 'Insert successful.'),
                    type: MESSAGE_FOR_INSERT,
                    isError: !!data.error
                }
                this.showMessage(msg)
                this.setState({
                    rates: data.result,
                    baseCurrency: '',
                    targetCurrency: '',
                    rate: ''
                })
                this.props.onRatesChange(data.result)
            });
        } else {
            // display validation errors from state.errors
            this.showMessage({
                text: 'All fields should not be empty!',
                type: MESSAGE_FOR_EDIT,
                isError: true
            })
        }
    }

    render() {
        // todo Do not show baseCurrency if has all rates defined.
        const { currencies } = this.props,
            rates = this.state.rates

        // message shown
        let message = null
        if (this.state.message.text) {
            if (!this.state.message.isError) {
                message =
                    <div className="help is-success">{this.state.message.text}</div>
            } else {
                message =
                    <div className="help is-danger">{this.state.message.text}</div>
            }
        }

        // Base currencies options
        const arrCurrencies = Object.keys(rates).map((currKey) => {
            return <option key={currKey} value={currKey}>{currencies[currKey]}</option>
        })
        const baseCurrencies = [
            <option key="0" value="">Base currency</option>,
            ...arrCurrencies
        ]


        // Target currencies options
        let arrTargetCurrencies = [], targetRates = null
        if (this.state.baseCurrency && 'rates' in rates[this.state.baseCurrency]) {
            targetRates = rates[this.state.baseCurrency].rates
            const currenciesWithRates = Object.keys(targetRates)
            log('HAS!!!!!!!', this.state.baseCurrency, currenciesWithRates)
            if (this.state.mode === MODE_EDIT) {
                arrTargetCurrencies = Object.keys(targetRates).map((currKey) => {
                    return <option key={currKey} value={currKey}>{currencies[currKey]}</option>
                })
            } else {  // this.state.mode === MODE_INSERT
                arrTargetCurrencies = Object.keys(currencies).map((currKey) => {
                    if (currenciesWithRates.indexOf(currKey) === -1 && currKey !== this.state.baseCurrency) {
                        return <option key={currKey} value={currKey}>{currencies[currKey]}</option>
                    } else {
                        return null
                    }
                })
            }
        }
        const targetCurrencies = [
            <option key="0" value="">Target currency</option>,
            ...arrTargetCurrencies
        ]

        // table rows: rateRows
        const rows = [];
        Object.keys(rates).map((key) => {
            for (const targetKey in rates[key].rates) {
                rows.push({baseCurrency: key, targetCurrency:targetKey, rate: rates[key].rates[targetKey]})
            }
        })
        const rateRows = rows.map( row =>
            <tr key={row.baseCurrency + '.' + row.targetCurrency}>
                <td>{row.baseCurrency +' ('+ currencies[row.baseCurrency] +')'}</td>
                <td>{row.targetCurrency +' ('+ currencies[row.targetCurrency] +')'}</td>
                <td>{round(row.rate, ROUND_DECIMALS)}</td>
                <td><a
                    href="#"
                    onClick={this.handleEditClick}
                    data-base={row.baseCurrency}
                    data-target={row.targetCurrency}
                    data-rate={round(row.rate, ROUND_DECIMALS)}>Edit</a>
                </td>
            </tr>
        )

        return (
            <div className="tile is-ancestor">
                <div className="tile is-3">
                </div>
                <div className="tile is-6 is-vertical box">
                    <div className="tile is-child">
                        <p className="subtitle">{this.state.mode === MODE_INSERT ? 'Create rate' : 'Edit rate'}</p>
                        <form onSubmit={this.handleSubmit}>
                            <div className="field is-horizontal">
                                <div className="field-body">
                                    <div className="field">
                                        <div className="control is-expanded">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="baseCurrency"
                                                    placeholder="Base"
                                                    value={this.state.baseCurrency}
                                                    onChange={this.handleChange}>
                                                    {baseCurrencies}
                                                </select>
                                            </div>
                                        </div>
                                        {message}
                                    </div>
                                    <div className="field">
                                        <div className="control is-expanded">
                                            <div className="select is-fullwidth">
                                                <select
                                                    name="targetCurrency"
                                                    placeholder="Target"
                                                    value={this.state.targetCurrency}
                                                    onChange={this.handleChange}>
                                                    {targetCurrencies}
                                                </select>
                                            </div>
                                        </div>
                                        {/*message*/}
                                    </div>
                                    <div className="field">
                                        <div className="control is-expanded">
                                            <input
                                                name="rate"
                                                className="input"
                                                type="number"
                                                placeholder="Rate"
                                                maxLength="15"
                                                value={this.state.rate}
                                                step="0.0001"
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <button className="button is-primary">
                                                {this.state.mode === MODE_INSERT ? 'Create' : 'Save'}
                                            </button>
                                            {   (this.state.mode === MODE_EDIT) &&
                                                <button type="reset" onClick={this.handleResetClick} className="button is-danger is-outlined">
                                                    Reset
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <p className="subtitle">Available rates</p>
                    <div className="tile is-child">
                        <table className="table is-striped is-narrow is-hoverable is-fullwidth">
                            <thead>
                            <tr>
                                <th>Base Currency</th>
                                <th>Target Currency</th>
                                <th>Rate</th>
                                <th>Edit</th>
                            </tr>
                            </thead>
                            <tbody>
                            { rateRows }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="tile is-3">
                </div>
            </div>
        )
    }
}


export default RatesTable
