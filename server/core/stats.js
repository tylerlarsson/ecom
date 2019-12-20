const { request } = require('./util');

class WistiaDriver {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.wistia.com/v1';
    this.uploadUrl = 'https://upload.wistia.com';
  }

  async uploadVideo(file) {
    const url = `${this.uploadUrl}?api_password=${this.apiKey}`;
    const { data } = await request({
      method: 'POST',
      payload: String(file.buffer),
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      url
    });
    return data;
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

module.exports = new WistiaDriver('');
