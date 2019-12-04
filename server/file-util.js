const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const mimeTypes = require('mime-types');
const request = require('./request');
const SEPARATOR = path.sep;

const p = __filename.split(SEPARATOR);
p.length -= 2;
const BASE_PATH = p.join(SEPARATOR) + SEPARATOR;

function readFile(...relativePath) {
  const file = BASE_PATH + relativePath.join(path.sep);
  return fs.readFileSync(file, 'utf8').toString();
}

function readJson(...relativePath) {
  return JSON.parse(readFile(...relativePath));
}

function bucketFactory(bucket = 'course-images') {
  const storage = new Storage({
    projectId: 'fleet-impact-256815',
    keyFilename: path.resolve(__dirname, './keyFilename.json')
  });
  return storage.bucket(bucket);
}

async function getSignedUrl(filename, opts, bucket = 'course-images') {
  const _bucket = await bucketFactory(bucket);
  const [url] = await _bucket.file(filename).getSignedUrl(opts);
  return url;
}

async function generateUploadUrl(filename, expires, bucket = 'course-images') {
  const contentType = mimeTypes.lookup(filename);
  if (!contentType) {
    throw new Error(`Can't lookup mime-type for ${filename}`);
  }
  const opts = {
    version: 'v4',
    action: 'write',
    expires: expires || Date.now() + 15 * 60 * 1000,
  };
  return getSignedUrl(filename, opts, bucket);
}

async function uploadVideo(file, apiPassword = 'test') {
  const url = `https://upload.wistia.com?api_password=${apiPassword}`;
  const {
    data: { hashed_id: hashedId, url: _url }
  } = await request({
    method: 'POST',
    payload: String(file.buffer),
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url
  });
  return { url: _url, hashedId };
}

module.exports = {
  readFile,
  readJson,
  BASE_PATH,
  bucketFactory,
  generateUploadUrl,
  getSignedUrl,
  uploadVideo
};
