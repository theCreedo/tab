import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import HeartIcon from 'material-ui/svg-icons/action/favorite'
// import HeartBorderIcon from 'material-ui/svg-icons/action/favorite-border'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import appTheme, {
  alternateAccentColor,
  lighterTextColor,
} from 'js/theme/default'
import Logo from 'js/components/Logo/Logo'
import CountdownClock from 'js/components/Campaign/CountdownClockComponent'

const styles = theme => ({
  inputInkbar: {
    '&:after': {
      backgroundColor: alternateAccentColor,
    },
  },
  inputLabelFocused: {
    color: alternateAccentColor,
  },
})

// Note: also hardcoded in StickerCampaignContainer
export const CAMPAIGN_START_TIME_ISO = '2018-02-13T23:00:00.000Z'
export const CAMPAIGN_END_TIME_ISO = '2018-02-23T20:00:00.000Z'

class StickerCampaign extends React.Component {
  onTextFieldClicked() {
    this.input.select()
  }

  getReferralUrl() {
    return `https://tab.gladly.io/?u=${this.props.user.username}`
  }

  render() {
    const { user, classes } = this.props
    const recruitsActiveForLessThanOneDay =
      user.recruits.totalRecruits - user.recruits.recruitsActiveForAtLeastOneDay
    const friendText =
      recruitsActiveForLessThanOneDay === 1 ? 'friend' : 'friends'
    const referralUrl = this.getReferralUrl()
    const anchorStyle = {
      textDecoration: 'none',
      color: alternateAccentColor,
    }

    // Heart icon style
    const successHeartColor = appTheme.palette.primary1Color
    const incompleteHeartColor = '#BBB'
    const heartStyle = {
      height: 42,
      width: 42,
    }

    return (
      <div
        style={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 12,
          paddingRight: 12,
          fontFamily: appTheme.fontFamily,
          color: appTheme.textColor,
        }}
      >
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: 20,
            marginTop: 4,
            lineHeight: '140%',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <Logo style={{ height: 30, marginRight: 8 }} />
            <span>Spread the love, get some love!</span>
          </span>
        </span>
        <span
          style={{
            display: 'block',
            fontSize: 14,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          Get 2 friends using Tab for a Cause for at least 1 day, and{' '}
          <a
            style={anchorStyle}
            href="https://www.facebook.com/notes/tab-for-a-cause/love-and-stickers-for-all/1718875268155553/"
            target="_blank"
          >
            we'll send you some laptop stickers
          </a>
          . Be one of the top recruiters and
          <a
            style={anchorStyle}
            href="https://shop.spreadshirt.com/tab-for-a-cause/"
            target="_blank"
          >
            {' '}
            have your pick of Tab gear!
          </a>
        </span>
        <div
          style={{
            marginTop: 8,
            marginBottom: 8,
            lineHeight: '120%',
          }}
        >
          {user.recruits.recruitsActiveForAtLeastOneDay > 0 ? (
            <HeartIcon color={successHeartColor} style={heartStyle} />
          ) : (
            <HeartIcon color={incompleteHeartColor} style={heartStyle} />
          )}
          {user.recruits.recruitsActiveForAtLeastOneDay > 1 ? (
            <HeartIcon color={successHeartColor} style={heartStyle} />
          ) : (
            <HeartIcon color={incompleteHeartColor} style={heartStyle} />
          )}
          <div
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: alternateAccentColor,
            }}
          >
            {user.recruits.recruitsActiveForAtLeastOneDay}/2 Tabbers recruited
          </div>
          <div
            style={{
              fontSize: 12,
              color: lighterTextColor,
            }}
          >
            {recruitsActiveForLessThanOneDay} {friendText} active for &lt;1 day
          </div>
        </div>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              width: 280,
              marginTop: 12,
              marginBottom: 12,
            }}
          >
            {' '}
            {user.recruits.recruitsActiveForAtLeastOneDay >= 2 ? (
              <span data-test-id={'sticker-campaign-success'}>
                <span
                  style={{
                    fontSize: 14,
                  }}
                >
                  Congrats, you did it! (And thanks!) Tell us where we should
                  send your prize:
                </span>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScVcV3EkYpkhqUG7hDGULUMJM_h57-3GnaRSg95p_UheP44dw/viewform"
                  target="_blank"
                >
                  <RaisedButton
                    label="Claim Your Stickers"
                    style={{
                      display: 'block',
                      marginTop: 8,
                    }}
                    primary
                  />
                </a>
              </span>
            ) : (
              <span data-test-id={'sticker-campaign-still-working'}>
                <TextField
                  id={'sticker-campaign-refer-friend-input'}
                  inputRef={input => {
                    this.input = input
                  }}
                  onClick={this.onTextFieldClicked.bind(this)}
                  value={referralUrl}
                  label={'Send this to a few friends:'}
                  fullWidth
                  InputProps={{
                    classes: {
                      inkbar: classes.inputInkbar,
                    },
                  }}
                  inputProps={{
                    style: {
                      fontSize: 14,
                      textAlign: 'left',
                    },
                  }}
                  InputLabelProps={{
                    FormControlClasses: {
                      focused: classes.inputLabelFocused,
                    },
                  }}
                />
              </span>
            )}
          </span>
          <span
            style={{
              fontSize: 12,
              color: lighterTextColor,
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            <span>
              <CountdownClock
                campaignStartDatetime={moment(CAMPAIGN_START_TIME_ISO)}
                campaignEndDatetime={moment(CAMPAIGN_END_TIME_ISO)}
              />{' '}
              remaining
            </span>
          </span>
        </span>
      </div>
    )
  }
}

StickerCampaign.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    recruits: PropTypes.shape({
      totalRecruits: PropTypes.number,
      recruitsActiveForAtLeastOneDay: PropTypes.number,
    }).isRequired,
  }),
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(StickerCampaign)
