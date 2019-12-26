const HttpStatus = require('http-status-codes');
const FormData = require('form-data');
const Driver = require('./driver');
const { request } = require('../util');
const { isVideo } = require('../file-util');

class WistiaDriver extends Driver {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.wistia.com/v1';
    this.uploadUrl = 'https://upload.wistia.com';
  }

  handleError = response => {
    const error = new Error(JSON.stringify(response.data));
    error.status = response.status;
    throw error;
  };

  normalizeHeatmap = heatmap => ({
    receivedAt: heatmap && heatmap.received_at,
    eventKey: heatmap && heatmap.event_key,
    percentViewed: heatmap && heatmap.percent_viewed,
    iFrame: heatmap && heatmap.iframe_heatmap_url,
    mediaId: heatmap && heatmap.media_id
  });

  async uploadVideo(file) {
    if (!isVideo(file.mimetype)) {
      const error = new Error(`Content type is not allowed.`);
      error.status = HttpStatus.UNPROCESSABLE_ENTITY;
      throw error;
    }
    const url = `${this.uploadUrl}?api_password=${this.apiKey}`;

    const form = new FormData();
    form.append('file', file.buffer, file.originalname);

    const response = await request({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...form.getHeaders()
      },
      payload: form,
      url
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
    const url = `${this.apiUrl}/medias/${hashedId}.json?api_password=${this.apiKey}`;
    const response = await request({
      method: 'DELETE',
      url
    });
    if (response.status !== HttpStatus.OK) {
      const error = new Error(JSON.stringify(response.data));
      error.status = response.status;
      throw error;
    }
    return response.data;
  }

  async getVideoHeatMap(videoId, visitor) {
    const url = `${this.apiUrl}/stats/events.json?api_password=${
      this.apiKey
    }&visitor_key=${visitor}&media_id=${videoId}`;
    const response = await request({
      method: 'GET',
      url
    });
    this.handleError(response);
    return response.data.map(i => this.normalizeHeatmap(i));
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
