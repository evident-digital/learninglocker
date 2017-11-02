/* eslint-disable react/jsx-indent */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withProps, compose } from 'recompose';
import { withModel } from 'ui/utils/hocs';
import { addModel } from 'ui/redux/modules/models';
import PersonaIdentifierForm from 'ui/components/PersonaIdentifierForm';
import PersonaMergeForm from 'ui/components/PersonaMergeForm';
import PersonaIdentifiers from 'ui/containers/PersonaIdentifiers';
import { Map } from 'immutable';
import classNames from 'classnames';
import uuid from 'uuid';

const schema = 'persona';

class PersonaView extends Component {
  static propTypes = {
    model: PropTypes.instanceOf(Map),
    updateModel: PropTypes.func,
    addModel: PropTypes.func
  };

  static defaultProps = {
    model: new Map()
  };

  state = {
    showIdentifiers: false,
    showAddForm: false,
    identifierType: 'mbox',
    identifierValue: ''
  };

  handleToggle = () => {
    this.setState({ showIdentifiers: !this.state.showIdentifiers });
  };

  handleShowAddForm = (e) => {
    e.preventDefault();
    this.setState({ showAddForm: true });
  };

  handleAdd = (e) => {
    e.preventDefault();
    const { model } = this.props;
    const { identifierType, identifierValue } = this.state;
    const props = {
      organisation: model.get('organisation'),
      ifi: {
        key: identifierType,
        value: identifierValue
      },
      persona: {
        $oid: model.get('_id')
      }
    };
    this.props.addModel({ schema: 'personaIdentifier', props });
    this.setState({ showAddForm: false });
  };

  handleIdentifierTypeChange = (identifierType) => {
    this.setState({ identifierType });
  };

  handleIdentifierValueChange = (identifierValue) => {
    this.setState({ identifierValue });
  };

  setAttr = (attr, value) => {
    this.props.updateModel({ path: [attr], value });
  };

  onChangeAttr = (attr, e) => {
    this.setAttr(attr, e.target.value);
  };

  renderButtons = () => {
    const { showAddForm, showIdentifiers } = this.state;
    const identityIconClasses = classNames({
      icon: true,
      'ion-chevron-right': !showIdentifiers,
      'ion-chevron-down': showIdentifiers
    });

    return (
      <div>
        <button
          id="toggle"
          className="btn btn-inverse btn-sm"
          onClick={this.handleToggle}>
          <i className={identityIconClasses} /> View identity information
        </button>
        {' '}

        {showAddForm
          ? <a className="btn btn-inverse btn-sm" onClick={this.handleAdd}>
              <i className="fa fa-floppy-o" /> Save identifier
            </a>
          : <a
            className="btn btn-inverse btn-sm"
            onClick={this.handleShowAddForm}>
              <i className="ion ion-plus" /> Add identifier
            </a>}
      </div>
    );
  };

  render = () => {
    const { model } = this.props;
    const {
      showIdentifiers,
      showAddForm,
      identifierType,
      identifierValue
    } = this.state;
    const showMergeForm = this.props.getMetadata('isMergeFormVisible', false);
    const nameId = uuid.v4();

    return (
      <div> {
        showMergeForm ? (
          <PersonaMergeForm schema={schema} id={model.get('_id')} />
        ) : (
        <div>
          <div className="form-group">
            <label htmlFor={nameId} className="control-label">
              Name
            </label>
            <input
              id={nameId}
              className="form-control"
              placeholder="Name"
              value={model.get('name') || ''}
              onChange={this.onChangeAttr.bind(null, 'name')} />
          </div>

          {this.renderButtons()}

          {showAddForm &&
            <PersonaIdentifierForm
              identifierType={identifierType}
              identifierValue={identifierValue}
              handleIdentifierTypeChange={this.handleIdentifierTypeChange}
              handleIdentifierValueChange={this.handleIdentifierValueChange} />}

          {showIdentifiers &&
            <div>
              <br />
              <h4>Persona Identifiers</h4>
              <hr />
              <PersonaIdentifiers personaId={model.get('_id')} />
            </div>}
        </div>
      )}
      </div>
    );
  };
}

export default compose(
  withProps(({ model }) => ({ schema, id: model.get('_id') })),
  withModel,
  connect(() => ({}), { addModel })
)(PersonaView);
