const HttpStatus = require('http-status-codes');
const _stripe = require('stripe');
const config = require('../config');
const Driver = require('./driver');

class StripeDriver extends Driver {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this._stripe = _stripe(this.apiKey);
  }

  static handleStripeError(error) {
    const _error = new Error(error.message);
    _error.status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    _error.type = error.type;
    throw _error;
  }

  async getUserInvoices({ customer, limit = 100 }) {
    try {
      const { data } = await this._stripe.invoiceItems.list({ customer, limit });
      return data.map(i => ({
        id: i && i.id,
        amount: i && i.amount,
        created: new Date(i && i.date),
        description: i && i.description
      }));
    } catch (error) {
      this.constructor.handleStripeError(error);
    }
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
      this.constructor.handleStripeError(error);
    }
  }

  async createSubscription(customer, plan) {
    try {
      const {
        id,
        created,
        plan: { amount }
      } = await this._stripe.subscriptions.create({
        customer,
        items: [{ plan }]
      });
      return {
        type: 'stripe',
        created: new Date(created),
        thirdPartyId: id,
        amount
      };
    } catch (error) {
      this.constructor.handleStripeError(error);
    }
  }

  createCustomer(args) {
    try {
      return this._stripe.customers.create(args);
    } catch (error) {
      this.constructor.handleStripeError(error);
    }
  }

  createProduct(name) {
    try {
      return this._stripe.products.create({ name });
    } catch (error) {
      this.constructor.handleStripeError(error);
    }
  }

  createPlan({ amount, interval, product, currency = 'usd' }) {
    try {
      return this._stripe.plans.create({
        amount,
        currency,
        interval,
        product
      });
    } catch (error) {
      this.constructor.handleStripeError(error);
    }
  }

  async cancelSubscription(subId) {
    try {
      const { status } = await this._stripe.subscriptions.del(subId);
      return status === 'canceled';
    } catch (error) {
      this.constructor.handleStripeError(error);
    }
  }

  async delProduct(product) {
    try {
      const { deleted } = await this._stripe.products.del(product);
      return deleted;
    } catch (error) {
      this.constructor.handleStripeError(error);
    }
  }

  async delPlan(plan) {
    try {
      const { deleted } = await this._stripe.plans.del(plan);
      return deleted;
    } catch (error) {
      this.constructor.handleStripeError(error);
    }
  }
}

module.exports = new StripeDriver(config.get('stripe-private'));
