const Driver = require('./driver');
const { request } = require('../util');

class PayPalDriver extends Driver {
  constructor(secret, client) {
    super();
    this.secret = secret;
    this.client = client;
    this.PAYPAL_API =
      process.env.NODE_ENV === 'production' ? 'https://api.paypal.com/v2' : 'https://api.sandbox.paypal.com/v2';
    this.PAYPAL_OAUTH_API = `${this.PAYPAL_API}/oauth2/token/`;
    this.PAYPAL_ORDER_API = `${this.PAYPAL_API}/checkout/token/`;
  }

  async authenticate(basicAuth) {
    const response = await request({
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${basicAuth}`
      },
      payload: 'grant_type=client_credentials',
      urL: this.PAYPAL_OAUTH_API
    });
    this.handleError(response);
    return response.data;
  }

  async singlePayment(orderId) {
    const basicAuth = this.getBasicAuth();
    const auth = await this.authenticate(basicAuth);
    const {
      data: {
        id,
        create_time: createTime,
        amount: { value: amount }
      }
    } = await request({
      method: 'GET',
      url: this.PAYPAL_ORDER_API + orderId,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${auth.access_token}`
      }
    });
    return {
      type: 'stripe',
      created: new Date(createTime),
      thirdPartyId: id,
      amount
    };
  }

  getBasicAuth = () => Buffer.from(`${this.client}:${this.secret}`).toString('base64');
}

module.exports = new PayPalDriver();
