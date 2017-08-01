
import dynogels from 'dynogels'
import {
  NotImplementedException,
  UnauthorizedQueryException
} from '../../utils/exceptions'
import dbClient from '../databaseClient'

dynogels.documentClient(dbClient)

class BaseModel {
  constructor (obj) {
    if (!obj || typeof obj !== 'object') {
      return
    }
    const fieldNames = [].concat(Object.keys(this.constructor.schema),
      ['created', 'updated'])
    fieldNames.forEach((fieldName) => {
      // Set properties for each field on the model.
      // Set the value to the value passed in `obj` if one exists.
      // If not passed a value in `obj`, use the defualt value
      // defined in the `fieldDefaults` method, if it exists.
      if (obj[fieldName]) {
        this[fieldName] = obj[fieldName]
      } else if (this.constructor.fieldDefaults[fieldName]) {
        this[fieldName] = this.constructor.fieldDefaults[fieldName]
      }
    })
  }

  /**
   * The name of the model.
   * You are required to override this function on the child class.
   * @return {string} The name of the model.
   */
  static get name () {
    throw new NotImplementedException()
  }

  /**
   * The name of the database table.
   * You are required to override this function on the child class.
   * @return {string} The name of the database table.
   */
  static get tableName () {
    throw new NotImplementedException()
  }

  /**
   * The name of the hashKey for the DynamoDB table.
   * You are required to override this function on the child class.
   * @return {string} The name of the hashKey for the DynamoDB table.
   */
  static get hashKey () {
    throw new NotImplementedException()
  }

  /**
   * The name of the range key (if it exists) for the DynamoDB table.
   * @return {string} The name of the hashKey for the DynamoDB table.
   */
  static get rangeKey () {
    return null
  }

  /**
   * The table schema, used in dynogels.
   * You are required to override this function on the child class.
   * @return {object} The table schema.
   */
  static get schema () {
    throw new NotImplementedException()
  }

  /**
   * Default values for the fields in schema.
   * @return {object} A map of default values
   */
  static get fieldDefaults () {
    return {}
  }

  /**
   * The permissions object, used to check authorization for database
   * operations. By default, no operations are authorized.
   * @return {object} The permissions object, with a key for each
   *   operation name. Each property value is a function that receives
   *   a user object, item hashKey, and item rangeKey, and must return
   *   a boolean for whether the query is authorized.
   */
  static get permissions () {
    return {
      get: (user, hashKeyValue, rangeKeyValue) => false,
      getAll: () => false,
      update: (user, hashKeyValue, rangeKeyValue) => false,
      create: (user, hashKeyValue) => false
    }
  }

  /**
   * Register the model with dynogels. This must be called prior to
   * using any methods that query the database.
   * @return {undefined}
   */
  static register () {
    // console.log(`Registering model ${this.name} to table ${this.tableName}.`)
    const options = {
      hashKey: this.hashKey,
      tableName: this.tableName,

      // Add two timestamps, `created` and `updated`, to
      // the item's fields.
      timestamps: true,
      createdAt: 'created',
      updatedAt: 'updated',

      schema: this.schema
    }
    if (this.rangeKey) {
      options['rangeKey'] = this.rangeKey
    }
    this.dynogelsModel = dynogels.define(this.name, options)
  }

  static get (user, hashKey, rangeKey, options) {
    const self = this
    let keys = [hashKey]
    if (rangeKey) {
      keys.push(rangeKey)
    }
    // console.log(`Getting obj with hashKey ${hashKey} from table ${this.tableName}.`)
    return new Promise((resolve, reject) => {
      if (!this.isQueryAuthorized(user, 'get', hashKey, rangeKey)) {
        reject(new UnauthorizedQueryException())
        return
      }
      this.dynogelsModel.get(...keys, (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(self.deserialize(data))
        }
      })
    })
  }

  static getAll (user) {
    // console.log(`Getting all objs in table ${this.tableName}.`)
    const self = this
    return new Promise((resolve, reject) => {
      if (!this.isQueryAuthorized(user, 'getAll')) {
        reject(new UnauthorizedQueryException())
        return
      }
      this.dynogelsModel.scan().exec((err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(self.deserialize(data.Items))
        }
      })
    })
  }

  static create (user, item) {
    // console.log(`Creating item in ${this.tableName}: ${JSON.stringify(item, null, 2)}`)
    const self = this
    const hashKey = item[this.hashKey]
    return new Promise((resolve, reject) => {
      if (!this.isQueryAuthorized(user, 'create', hashKey)) {
        reject(new UnauthorizedQueryException())
        return
      }
      this.dynogelsModel.create(item, (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(self.deserialize(data))
        }
      })
    })
  }

  static update (user, item) {
    // console.log(`Updating item in ${this.tableName}: ${JSON.stringify(item, null, 2)}`)
    const self = this
    const hashKey = item[this.hashKey]
    const rangeKey = item[this.rangeKey]
    return new Promise((resolve, reject) => {
      if (!this.isQueryAuthorized(user, 'update', hashKey, rangeKey)) {
        reject(new UnauthorizedQueryException())
        return
      }
      this.dynogelsModel.update(item, { ReturnValues: 'ALL_NEW' }, (err, data) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(self.deserialize(data))
        }
      })
    })
  }

  /**
   * Return a modified object or list of object from the
   * database item or items.
   * @param {Object || Object[]} obj - The database object or list of objects.
   * @return {Object | Object[]} An instance of `this`, with the attributes
   *   of `obj` and possibly some additional default attributes.
  */
  static deserialize (data) {
    const deserializeObj = (item) => {
      // Item may be null.
      if (!item) {
        return null
      }

      // Create an instance of the model class so that we can use
      // the class type in `nodeDefinitions` in schema.
      const Cls = this
      return new Cls(item.attrs)
    }

    var result
    if (data instanceof Array) {
      result = []
      for (var index in data) {
        result.push(deserializeObj(data[index]))
      }
    } else {
      result = deserializeObj(data)
    }
    return result
  }

  /**
   * Determine whether the user is authorized to make a particular
   * database query.
   * @param {obj} user - The user object passed as context
   * @param {string} operation - The operation type (e.g. "get" or "update")
   * @param {string} hashKeyValue - The value of the item hashKey in the query
   * @param {string} rangeKeyValue - The value of the item rangeKey in the query
   * @return {boolean} Whether the user is authorized.
   */
  static isQueryAuthorized (user, operation, hashKeyValue, rangeKeyValue) {
    // If the user is null or not an object, reject.
    if (!user || typeof user !== 'object') {
      return false
    }

    const validOperations = [
      'get',
      'getAll',
      'update',
      'create'
    ]
    if (validOperations.indexOf(operation) === -1) {
      return false
    }

    // Get the permissions from the model class. If no permissions are
    // defined, do not allow any access.
    const permissions = this.permissions
    if (!permissions) {
      return false
    }

    // Get the authorizer function from the model class for this operation.
    // If the function does not exist, do not allow any access.
    const authorizerFunction = permissions[operation]
    if (!authorizerFunction || !(typeof authorizerFunction === 'function')) {
      return false
    }

    // If the authorizer function returns `true`, the query is authorized.
    return authorizerFunction(user, hashKeyValue, rangeKeyValue) === true
  }
}

export default BaseModel
