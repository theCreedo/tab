import React from 'react'
import PropTypes from 'prop-types'
import DonateVcMutation from 'js/mutations/DonateVcMutation'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Dialog from 'material-ui/Dialog'
import Popover from 'material-ui/Popover'
import Slider from 'material-ui/Slider'

import appTheme from 'js/theme/default'

class DonateHeartsControls extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      amountToDonate: 1,
      customAmountSliderOpen: false,
      donateInProgress: false,
      thanksDialog: false
    }
  }

  componentDidMount () {
    const { user } = this.props
    this.setState({
      amountToDonate: user.vcCurrent
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.user.vcCurrent !== nextProps.user.vcCurrent) {
      this.setState({
        amountToDonate: nextProps.user.vcCurrent
      })
    }
  }

  openCharityWebsite () {
    const { charity } = this.props

    // The page might be iframed, so opening in _top or _blank is critical.
    window.open(charity.website, '_blank')
  }

  openCustomSlider (event) {
    this.setState({
      customAmountSliderOpen: true,
      anchorEl: event.currentTarget
    })
  }

  closeCustomSlider () {
    this.setState({
      customAmountSliderOpen: false
    })
  }

  onCustomSliderValChange (event, value) {
    this.setState({amountToDonate: value})
  }

  thanksDialogShow () {
    this.setState({
      thanksDialog: true,
      donateInProgress: false
    })
  }

  thanksDialogClose () {
    this.setState({
      thanksDialog: false
    })
  }

  heartsDonationError () {
    this.props.showError('Oops, we could not donate your Hearts just now :(')
    this.setState({
      donateInProgress: false
    })
  }

  donateHearts () {
    if (this.state.amountToDonate <= 0 || this.state.donateInProgress) {
      return
    }
    this.setState({
      donateInProgress: true
    })
    const { charity, user } = this.props
    const self = this
    DonateVcMutation.commit(
      this.props.relay.environment,
      user,
      charity.id,
      this.state.amountToDonate,
      self.thanksDialogShow.bind(this),
      self.heartsDonationError.bind(this)
    )
  }

  render () {
    const { charity, user } = this.props

    const MIN_VC_FOR_CUSTOM_SLIDER = 2

    // Post-donation dialog style
    // https://github.com/callemall/material-ui/issues/1676#issuecomment-236621533
    const dialogStyle = {
      dialogRoot: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0
      },
      dialogContent: {
        position: 'relative',
        width: '80vw',
        transform: '',
        marginBottom: 80
      },
      dialogBody: {
        paddingBottom: 0
      }
    }
    const thanksDialogTitleStyle = {
      textAlign: 'center'
    }
    const thanksDialogImgContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      maxWidth: '100%'
    }
    const thanksDialogImgStyle = {
      height: 240,
      border: `4px solid ${appTheme.palette.primary1Color}`
    }
    const thanksDialogTextStyle = {
      display: 'block',
      marginTop: 14,
      paddingLeft: '10%',
      paddingRight: '10%'
    }
    const linkToCharityStyle = {
      color: appTheme.palette.primary1Color,
      cursor: 'pointer'
    }

    const heartsText = this.state.amountToDonate === 1 ? 'Heart' : 'Hearts'

    return (
      <span>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 24
          }}
        >
          <Button
            color={'primary'}
            variant={'contained'}
            disabled={this.state.amountToDonate <= 0 || this.state.donateInProgress}
            onClick={this.donateHearts.bind(this)}
          >
            Donate {this.state.amountToDonate} {heartsText}
          </Button>
          <span
            style={{
              display: user.vcCurrent > MIN_VC_FOR_CUSTOM_SLIDER ? 'block' : 'none',
              fontSize: 11,
              color: appTheme.palette.disabledColor,
              cursor: 'pointer',
              marginTop: 5
            }}
            onClick={this.openCustomSlider.bind(this)}>
            <Typography
              variant={'caption'}
              style={{
                color: appTheme.palette.disabledColor
              }}
            >
                Or, donate a specific amount
            </Typography>
          </span>
        </span>
        <Popover
          open={this.state.customAmountSliderOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeCustomSlider.bind(this)}
          useLayerForClickAway={false}
        >
          <div
            style={{
              width: 330,
              height: 'auto',
              padding: 20
            }}
          >
            <span
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 10
              }}
            >
              <Typography
                variant={'body2'}
              >
                Fewer Hearts
              </Typography>
              <Typography
                variant={'body2'}
              >
                More Hearts
              </Typography>
            </span>
            { user.vcCurrent > MIN_VC_FOR_CUSTOM_SLIDER
              ? <Slider
                sliderStyle={{
                  margin: 0
                }}
                min={1}
                max={user.vcCurrent}
                step={1}
                defaultValue={1}
                value={this.state.amountToDonate}
                onChange={this.onCustomSliderValChange.bind(this)}
              />
              : null
            }
          </div>
        </Popover>
        <Dialog
          title='Thank you for donating your Hearts!'
          contentStyle={dialogStyle.dialogContent}
          bodyStyle={dialogStyle.dialogBody}
          style={dialogStyle.dialogRoot}
          titleStyle={thanksDialogTitleStyle}
          modal={false}
          actions={[
            <Button
              color={'primary'}
              variant={'contained'}
              style={{ marginRight: 10, marginBottom: 10 }}
              onClick={this.thanksDialogClose.bind(this)}
            >
              Done
            </Button>
          ]}
          open={this.state.thanksDialog}
          onRequestClose={this.thanksDialogClose.bind(this)}>
          <span style={thanksDialogImgContainerStyle}>
            <img
              alt={`A demonstration of the work by ${charity.name}.`}
              style={thanksDialogImgStyle}
              src={charity.image}
            />
          </span>
          <span style={thanksDialogTextStyle}>
            <p
              style={{
                marginTop: 0,
                paddingLeft: 20,
                paddingRight: 20
              }}
            >
              Thanks for donating to{' '}
              <span
                style={linkToCharityStyle}
                onClick={this.openCharityWebsite.bind(this)}>{charity.name}</span>!
            </p>
            <p
              style={{
                marginTop: 0,
                paddingLeft: 20,
                paddingRight: 20
              }}
            >
              {charity.impact}
            </p>
          </span>
        </Dialog>
      </span>
    )
  }
}

DonateHeartsControls.propTypes = {
  charity: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    impact: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    website: PropTypes.string.isRequired
  }),
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    vcCurrent: PropTypes.number.isRequired
  }),
  showError: PropTypes.func.isRequired,
  style: PropTypes.object
}

DonateHeartsControls.defaultProps = {
  style: {}
}

export default DonateHeartsControls
