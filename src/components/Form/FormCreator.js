/**
 * FormCreator
 *
 * Do not use this class directly.
 * Extend this class to create your form component.
 *
 * FormCreator provides the methods useful to all forms
 */

import React, { Component } from 'react';
import { FormValidator } from 'components';
import {
  Button,
  Card,
  CardActions,
  CardContent
} from '@material-ui/core';
import { PROPTYPES, DEFAULT_PROPS, SCHEMA_KEYS } from './config';

class FormCreator extends Component {

  /**
   * constructor
   *
   * Constructor sets 2 class properties, disabled and schema.
   * this.disabled is true if the form is not editable
   * this.schema is the form schema provided by the API.
   *
   * @param {Object} props [the props passed to Form]
   */
  constructor(props) {

    super(props);

    this.disabled = false;
    this.schema = this.props.form.schema ? this.props.form.schema : {};

  }

  /**
   * getHelpText
   *
   * Generates help text, if any, that will appear with the form input element.
   * Help text is the name of the region, and may be either contextual help that
   * goes with the form, or a form validation error, or both.
   *
   * getHelpText checks the form schema for any help text first, and, if none is found, uses the defaultHelpText, if it's provided.
   * It also checks the form validation to see if the data entered by the user is valid. If not, it adds the error message.
   *
   * getHelpText returns a string. It does not style the help text.
   *
   * @param  {String} [prop='']            [The form input element name]
   * @param  {String} [defaultHelpText=''] [The default text to use if there is no help text in the schema]
   * @return {String}
   */
  getHelpText = (prop = '', defaultHelpText = '') => {

    const VALIDATION = this.state.validation;
    const SCHEMA = this.schema;

    let errorText = VALIDATION[prop].isInvalid ? VALIDATION[prop].message : '';
    let helpText = SCHEMA[prop] && SCHEMA[prop][SCHEMA_KEYS.help] ? SCHEMA[prop][SCHEMA_KEYS.help] : defaultHelpText;

    let ret = '';

    if(errorText && helpText) {
      ret = errorText + ' - ' + helpText;
    }
    else if(errorText && !helpText) {
      ret = errorText;
    }
    else {
      ret = helpText;
    }

    return ret;

  }

  /**
   * getLabel
   *
   * Generates a <label> element for an input
   *
   * Sometimes a label may be provided by the form schema.
   * If it is, that's what's used. If not, it uses the defaultLabel you provided
   *
   * getLabel also checks the formValidator to see if the input is required
   * If it is, an indicator is added.
   *
   * getLabel also checks state to see if invalid data has been entered.
   * If so, it adds an indicator
   *
   * getLabel returns only the innerHTML of the label. This is because, in many
   * cases, the <label> element is generated by the input component.
   * If not, remember to wrap the return in a <label> element
   *
   * @param  {String} [prop='']         [the name of the input element]
   * @param  {String} [defaultLabel=''] [the default label to use if none is provided by the form schema]
   * @return {JSX}
   */
  getLabel = (prop = '', defaultLabel = '') => {

    let label = defaultLabel;
    const VALIDATOR = this.formValidator.validations.find( elem => elem.field === prop ) || {};

    if(this.schema.hasOwnProperty(prop)) {
      if(this.schema[prop].hasOwnProperty(SCHEMA_KEYS.title)) {
        label = this.schema[prop][SCHEMA_KEYS.title];
      }
    }

    if(VALIDATOR.hasOwnProperty('method')) {
      if(VALIDATOR.method === 'isEmpty') {
        label = <span><span className="text-red">*</span> {label}</span>;
      }
    }

    if(this.state.validation.hasOwnProperty(prop)) {
      if(this.state.validation[prop].isInvalid) {
        label = <span><span className="text-red">!</span> {label}</span>;
      }
    }

    return label;

  }

  /**
   * getValue
   *
   * getValue gets the current value of an input.
   *
   * The comparator is used for input groups, like radio buttons.
   * Since these are booleans (the checked attribute is true or false)
   * it compares the value to the comparator.
   *
   * Say I have 2 radio buttons:
   *   <radio name="myRadio" value="yes" />
   *   <radio name="myRadio" value="no" />
   *
   * I can call getValue with a comparator, which is the value of the radio element,
   * and assign that to the checked attribute.
   *   <radio name="myRadio" value="yes" checked={this.getValue('myRadio', 'yes')} />
   *   <radio name="myRadio" value="no" checked={this.getValue('myRadio', 'no')} />
   *
   * Since the value is stored in state for the entire group, there will be only one checked radio button.
   *
   * @param  {[type]} prop            [The name of the input element]
   * @param  {String} [comparator=''] [Optional comparator value for input groups]
   * @return {Sting | Bool}
   */
  getValue = (prop, comparator = '') => {

    return comparator ? this.state[prop] === comparator : this.state[prop];

  }

  /**
   * handleChange
   *
   * It is highly recommended you use controlled inputs.
   * If you do, this is the change handler.
   * This is what keeps state updated with user entered values
   *
   * @param  {[type]} e [the onChange event]
   * @return {Object (this)}
   */
  handleChange = (e) => {

    const TARGET = e.target;
    const VALUE = TARGET.type === 'checkbox' ? TARGET.checked : TARGET.value;
    const NAME = TARGET.name;

    return this.setState({ [NAME]: VALUE });

  }

  /**
   * handleSubmit
   *
   * The submit handler. You do not have to bind this handler
   * if you used renderForm to wrap your inputs.
   *
   * @param  {[type]} e [the submit event]
   * @return {null}
   */
  handleSubmit = (e) => {

    e.preventDefault();

    let ret = {};

    const VALIDATION = this.formValidator.validate(this.state);

    if(VALIDATION.isValid) {
      Object.assign(ret, this.state);
      delete ret.validation;
      if(ret.hasOwnProperty('disclosureAccepted')) {
        ret.editable = !ret.disclosureAccepted;
        delete ret.disclosureAccepted;
      }
      this.props.submitFormCallback(ret);
    }

  }

  /**
   * isValidationError
   *
   * Check to see if a form input is valid or not
   *
   * @param  {[type]}  prop [the input name]
   * @return {Boolean}
   */
  isValidationError = (prop) => {

    return this.state.validation[prop] ? this.state.validation[prop].isInvalid : false;

  }

  /**
   * toggleDisclosure
   *
   * This is used to show/hide a disclosure on a phone.
   * On a desktop, disclosures are displayed inline, but on a phone
   * they are displayed in a modal. This toggles the modal.
   *
   * @param  {Boolean} [toggle=true] [Whether or not to toggle the disclosure.
   *                                   Usually, don't worry about this, but the callback
   *                                   may need to do other stuff, or you may need to call
   *                                   the callback function, and keep the disclosure open]
   * @return {Object}
   */
  toggleDisclosure = (toggle = true) => {

    return this.props.toggleDisclosureOverlayCallback ? this.props.toggleDisclosureOverlayCallback(toggle) : this;

  }

  /**
   * renderForm
   *
   * This will wrap your form elements in form markup, complete with submit and cancel buttons
   *
   * @param  {JSX} form [Your form inputs markup]
   * @return {JSX}
   */
  renderForm = (form) => {

    return (
      <form onSubmit={this.handleSubmit}>
        <Card className={this.props.classes.form} elevation={0}>
          <CardContent>
            {form}
          </CardContent>
          <CardActions className={this.props.classes.formActions}>
            { this.props.showCancel ? <Button className={this.props.classes.cancelButton} color={this.props.buttonColor} onClick={this._toggleTask}>cancel</Button> : null }
            <Button className={this.props.classes.submitButton} disabled={this.disabled} variant="raised" color={this.props.buttonColor} type="submit">{this.props.submitLabel}</Button>
          </CardActions>
        </Card>
      </form>
    );

  }

  /**
   * setInitialState
   *
   * Sets the initial state of the form
   * Pass an array of input names, and it will
   * spin through them, adding them to state, along with
   * the values, if any, provided by the API
   *
   * @param {Array} keys [List of form input names]
   */
  setInitialState = (keys) => {

    const FIELDS = this.props.fields;

    let initialState = {};

    keys.forEach(function (key) {
      initialState[key] = FIELDS[key] ? FIELDS[key] : ''
    });

    initialState.validation = this.formValidator ? this.formValidator.reset() : null;

    return this.setState(initialState);

  }

  /**
   * setValidations
   *
   * Create a FormValidator instance with the validations
   * you provided.
   *
   * Call this method in your form class before the component mounts
   * using componentWillMount
   *
   * @param {Array} validations [a list of validations.]
   */
  setValidations = (validations) => {

    this.formValidator = new FormValidator(validations);

  }

  /**
   * showDocument
   *
   * Some forms may have attachments. To view those attachments,
   * use this method, and the document will open in a new window
   *
   * @param  {String} doc [The URL of the document to show]
   */
  showDocument = (doc) => {

    return window.open(doc);

  }

  /**
   * Private methods
   */
  _acceptDisclosure = (e) => {

    e.preventDefault();

    this.setState({'disclosureAccepted': true})

    return this.toggleDisclosure();

  }

  _rejectDisclosure = (e) => {

    e.preventDefault();

    this.setState({'disclosureAccepted': false})

    return this.toggleDisclosure();

  }

  _toggleDisclosure = (e) => {

    e.preventDefault();

    return this.toggleDisclosure();

  }

}

FormCreator.propTypes = PROPTYPES;
FormCreator.defaultProps = DEFAULT_PROPS;

export default FormCreator;
