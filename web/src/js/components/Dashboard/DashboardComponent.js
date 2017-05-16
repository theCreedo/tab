/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import PropTypes from 'prop-types';
import VcUser from '../User/VcUserContainer';
import UserDisplay from '../User/UserDisplayContainer';
import UserBackgroundImage from '../User/UserBackgroundImageContainer';
import DonateVcView from '../Donate/DonateVcView';
import WidgetsView from '../Widget/WidgetsView';

import { FormattedMessage } from 'react-intl';
import { goTo } from 'navigation/navigation';

import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

import {
  grey300,
} from 'material-ui/styles/colors';

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      bkgSelectorOpened: false,
      donateDialogOpened: false
    };
  }

  goToSettings() {
    goTo('/settings');
  }

  goToDonate() {
    goTo('/donate');
  }

  changeBkgSelectorState(state) {
    this.setState({
      bkgSelectorOpened: state,
    });
  }

  changeDonateDialogState(state) {
    this.setState({
      donateDialogOpened: state,
    });
  }

  render() {

    const { user } = this.props;

    const content = {
      height: '100vh',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 'auto',
      backgroundColor: 'rgba(0,0,0,.2)',
    }

    const subtitle = {
      color: 'white',
      fontSize: '2.5em',
      fontWeight: 'lighter',
    };

    const actioBtnContainer = {
      position: 'absolute',
      bottom: 10,
      right: 0,
      display: 'flex',
      width: 100,
      justifyContent: 'space-around'
    }

    const quote = {
      position: 'absolute',
      bottom: 10,
      left: 40,
      color: 'white',
      fontSize: '1em',
      fontWeight: 'normal',
      fontFamily: "'Comic Sans MS', cursive, sans-serif",
      width: 300,
      marginLeft: 'auto',
      marginRight: 'auto',
    }

    // <UserDisplay user={user} />

    return (
      <div>
        <UserBackgroundImage user={user} />
        <div style={content}>
          <VcUser user={user} />
          <h1 style={quote}>
            <FormattedMessage
              id={'app.quote'}
              defaultMessage={ '“Surf the web, save the world.”' }/>
          </h1>
        </div>
        <WidgetsView />
        <div style={actioBtnContainer}>
          <IconButton 
            tooltip="Donate"
            tooltipPosition="top-center"
            onClick={this.goToDonate.bind(this)}>
            <FontIcon 
              color={grey300}
              hoverColor={'#FFF'}
              className="fa fa fa-heart fa-lg" />
          </IconButton>
          <IconButton 
            tooltip="Settings"
            tooltipPosition="top-center"
            onClick={this.goToSettings.bind(this)}>
            <FontIcon 
              color={grey300}
              hoverColor={'#FFF'}
              className="fa fa fa-cog fa-lg" />
          </IconButton>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired
};

export default Dashboard;
