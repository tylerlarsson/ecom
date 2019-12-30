class Driver {
  handleError(response) {
    const error = new Error(JSON.stringify(response.data));
    error.status = response.status;
    throw error;
  }
}

module.exports = Driver;
