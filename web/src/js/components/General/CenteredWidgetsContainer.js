import React from 'react'

class CenteredWidgetsContainer extends React.Component {
  render () {
    const root = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      overflow: 'hidden',
      boxSizing: 'border-box',
      pointerEvents: 'none'
    }

    return (
      <div style={root}>
        {this.props.children}
      </div>
    )
  }
}

export default CenteredWidgetsContainer
