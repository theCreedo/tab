
import {
  updateWidgetEnabled
} from './updateWidget'

// TODO: update test widgets table!
const widgetConfigurations = [
  // Bookmarks
  {
    id: 'a8cfd733-639b-49d4-a822-116cc7e5c2e2',
    enabled: true
  },
  // Notes
  {
    id: '63859963-f691-42f6-bc80-ac83eddc4104',
    enabled: true
  },
  // Search
  {
    id: '4f254eca-36c8-45d8-a91c-e5b6051b0d6d',
    enabled: true
  }
  // // To-dos
  // {
  //   id: 'b7645e93-62d0-4293-83fc-c19d499eaefe',
  //   enabled: false
  // },
  // // Clock
  // {
  //   id: '8b5e572b-7f44-45ea-965b-55e6a22ca190',
  //   enabled: false
  // }
]

/**
 * Set up the default widget configuration for a new user.
 * @param {object} userContext - The user authorizer object.
 * @param {string} userId - The user id.
 * @return {Promise<boolean>} A promise that resolves into `true`
 *   when complete
 */
export default async (userContext, userId) => {
  return Promise.all(widgetConfigurations.map(async (widgetConfig) => {
    try {
      await updateWidgetEnabled(userContext, userId, widgetConfig.id,
        widgetConfig.enabled)
    } catch (err) {
      throw err
    }
  }))
    .then(data => true)
    .catch(err => {
      throw err
    })
}