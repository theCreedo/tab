import React from 'react'
import Paper from 'material-ui/Paper'
import Typography from '@material-ui/core/Typography'
import RaisedButton from 'material-ui/RaisedButton'
import { absoluteUrl, loginURL } from 'js/navigation/navigation'
import { getUrlParameters } from 'js/utils/utils'

// This view primarily exists as an intermediary to open
// the authentication page outside of an iframe, because
// authentication may not work properly within an iframe.
// E.g., see: https://github.com/gladly-team/tab/issues/188
// Most often, users will see this if they are not authenticated
// and open a new tab; our browser extensions currently iframe
// the page.
class SignInIframeMessage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // Whether we are requiring the anonymous user to sign in.
      isMandatoryAnonymousSignIn: getUrlParameters()['mandatory'] === 'true',
    }
  }

  openAuthOutsideIframe() {
    window.open(absoluteUrl(loginURL), '_top')
  }

  render() {
    const showRequiredSignInExplanation = this.state.isMandatoryAnonymousSignIn
    var buttonLabel = 'SIGN IN'
    return (
      <Paper
        zDepth={1}
        style={{
          padding: 24,
          maxWidth: 400,
          backgroundColor: '#FFF',
          marginBottom: 60,
        }}
      >
        <Typography variant={'h6'}>
          {showRequiredSignInExplanation
            ? `Great job so far!`
            : `Let's get started!`}
        </Typography>
        {showRequiredSignInExplanation ? (
          <Typography variant={'body2'}>
            You've already made a positive impact! Let's keep this progress
            safe: we ask you to sign in after a while so you don't lose access
            to your notes, bookmarks, and Hearts (even if you drop your computer
            in a puddle).
          </Typography>
        ) : (
          <Typography variant={'body2'}>
            Sign in to customize your new tab page and raise money for your
            favorite causes.
          </Typography>
        )}
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24,
          }}
        >
          <RaisedButton
            data-test-id={'sign-in-iframe-message-button'}
            label={buttonLabel}
            primary
            onClick={this.openAuthOutsideIframe.bind(this)}
          />
        </span>
      </Paper>
    )
  }
}

export default SignInIframeMessage
