const HttpStatus = require('http-status-codes');
const _stripe = require('stripe');
const Driver = require('./driver');

class StripeDriver extends Driver {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this._stripe = _stripe(this.apiKey);
  }

  async charge(amount, source) {
    try {
      const { id, amount, description, created } = await this._stripe.charges.create({
        description: 'Charge for a course',
        source,
        amount
      });
      return {
        type: 'stripe',
        created: new Date(created),
        thirdPartyId: id,
        description,
        amount
      };
    } catch (error) {
      const _error = new Error(error.message);
      _error.status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      _error.type = error.type;
      throw _error;
    }
  }
}

module.exports = new StripeDriver('');
