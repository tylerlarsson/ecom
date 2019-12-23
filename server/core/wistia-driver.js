const HttpStatus = require('http-status-codes');
const { request, isHash } = require('./util');
const { isVideo } = require('./file-util');

class WistiaDriver {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.wistia.com/v1';
    this.uploadUrl = 'https://upload.wistia.com';
  }

  async uploadVideo(file) {
    if (!isVideo(file.type)) {
      const error = new Error(`Content type is not allowed.`);
      error.status = HttpStatus.UNPROCESSABLE_ENTITY;
      throw error;
    }
    const payload = await file.arrayBuffer().toString();
    const url = `${this.uploadUrl}?api_password=${this.apiKey}`;
    const response = await request({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      url,
      payload
    });
    if (response.status === HttpStatus.BAD_REQUEST) {
      const error = new Error(JSON.stringify(response.data));
      error.status = HttpStatus.BAD_REQUEST;
      throw error;
    } else if (response.status === HttpStatus.UNAUTHORIZED) {
      const error = new Error(`Authorization error. Check your Wistia api_password.`);
      error.status = HttpStatus.UNAUTHORIZED;
      throw error;
    }
    return response.data;
  }

  async deleteVideo(hashedId) {
    if (!isHash(hashedId)) {
      const error = new Error(`${hashedId} is not a hash.`);
      error.status = HttpStatus.UNPROCESSABLE_ENTITY;
      throw error;
    }
    const url = `${this.uploadUrl}/medias/${hashedId}.json`;
    const response = await request({
      method: 'DELETE',
      url
    });
    if (response.status !== HttpStatus.OK) {
      const error = new Error(JSON.stringify(response.data));
      error.status = response.status;
      throw error;
    }
    return response;
  }

  async getMediaStats(mediaId) {
    const url = `${this.apiUrl}/stats/medias/${mediaId}.json`;
    const { data } = await request({
      method: 'GET',
      url
    });
    return data;
  }

  async getVisitorOverall() {
    const url = `${this.apiUrl}/stats/visitors.json`;
    const { data } = await request({
      method: 'GET',
      url
    });
    return data;
  }

  async getVisitorInfo(visitorKey) {
    const url = `${this.apiUrl}/stats/visitors/${visitorKey}.json`;
    const { data } = await request({
      method: 'POST',
      url
    });
    return data;
  }
}

module.exports = new WistiaDriver('bd1af011eb07adcac3dce5747ea7ec73099b2761225a9c015da824c4521e9def');
