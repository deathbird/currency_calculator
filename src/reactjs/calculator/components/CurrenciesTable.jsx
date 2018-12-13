/**
 * Currencies listing and insert functionality component.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {log} from "../utils"
import {MODE_EDIT, MODE_INSERT, ERRORS_HIDE_TIMEOUT, MESSAGE_FOR_INSERT, MESSAGE_FOR_EDIT} from "../constants"

class CurrenciesTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currencies: props.currencies,
            code: '',
            description: '',
            mode: MODE_INSERT,      // insert mode by default
            message: {
                text:'',
                type:'',
                isError: false
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.showMessage = this.showMessage.bind(this)
        this.validate = this.validate.bind(this)
        this.insert = this.insert.bind(this)
    }

    /**
     * When a input field is changed.
     *
     * @param e
     */
    handleChange(e) {
        e.preventDefault()
        const value = e.target.name === 'code' ? e.target.value.toUpperCase() : e.target.value;
        this.setState({[e.target.name]: value})
    }

    /**
     * When a new currency is submitted.
     *
     * @param e
     */
    handleSubmit(e) {
        e.preventDefault()
        if (this.state.mode === MODE_INSERT) {
            this.insert()
        } else if (this.state.mode === MODE_EDIT) {

        }
    }

    /**
     * Show error or other message under input fields.
     *
     * @param text
     * @param type
     * @param isError
     */
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

    /**
     * Validates inputs.
     *
     * @returns {number | boolean}
     */
    validate() {
        return this.state.code.length &&
            this.state.description.length &&
            new RegExp('[A-Z]{3}').test(this.state.code)
    }

    /**
     * Fetch API default options.
     *
     * @returns {{credentials: string, headers: Headers}}
     */
    fetchDefaultOptions() {
        return {
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        }
    }

    /**
     * Insert new currency.
     */
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
                        code: this.state.code,
                        description: this.state.description
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
                    currencies: data.result,
                    code: '',
                    description: ''
                })
                this.props.onCurrencyChange(data.result)
            });
        } else {
            // display validation errors from state.errors
            this.showMessage({
                text: 'Code should be 3 upper case latin characters and description should not be empty!',
                type: MESSAGE_FOR_INSERT,
                isError: true
            })
        }
    }

    render() {
        const currencies  = this.state.currencies
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
        return (
            <div className="tile is-ancestor">
                <div className="tile is-3">
                </div>
                <div className="tile is-6 is-vertical box">
                    <div className="tile is-child">
                        <p className="subtitle">Create currency</p>
                        <form onSubmit={this.handleSubmit}>
                            <div className="field is-horizontal">
                                <div className="field-body">
                                    <div className="field">
                                        <div className="control">
                                            <input
                                                name="code"
                                                className="input"
                                                type="text"
                                                placeholder="Code"
                                                maxLength="3"
                                                value={this.state.code}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        {message}
                                    </div>
                                    <div className="field">
                                        <div className="control is-expanded">
                                            <input
                                                name="description"
                                                className="input"
                                                type="text"
                                                placeholder="Description"
                                                maxLength="20"
                                                value={this.state.description}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <div className="control">
                                            <button className="button is-primary">
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <p className="subtitle">Available currencies</p>
                    <div className="tile is-child">
                        <table className="table is-striped is-narrow is-hoverable is-fullwidth">
                            <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                Object.keys(currencies).map((key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{currencies[key]}</td>
                                        </tr>
                                    )
                                })
                            }
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


export default CurrenciesTable
