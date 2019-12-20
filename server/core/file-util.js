const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage/build/src/index');
const mimeTypes = require('mime-types');
const { request } = require('../core/util');
const SEPARATOR = path.sep;

const p = __filename.split(SEPARATOR);
p.length -= 3;
const BASE_PATH = p.join(SEPARATOR) + SEPARATOR;

function checkFile(path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.F_OK, err => {
      if (err) reject(err);
      else resolve(true);
    });
  });
}

const isVideo = contentType => /video\/.*/.test(contentType);

function getFilePath(...relativePath) {
  return BASE_PATH + relativePath.join(path.sep);
}

function readFile(...relativePath) {
  const file = getFilePath(...relativePath);
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
    const error = new Error(`Can't lookup mime-type for ${filename}`);
    error.status = 422;
    throw error;
  }
  if (isVideo(contentType)) {
    const error = new Error(`Content type is not allowed.`);
    error.status = 422;
    throw error;
  }
  const opts = {
    version: 'v4',
    action: 'write',
    expires: expires || Date.now() + 15 * 60 * 1000,
    contentType
  };
  const hashedFilename = crypto.randomBytes(16).toString('hex') + filename;
  return getSignedUrl(hashedFilename, opts, bucket);
}

async function deleteFileGcs(url, _bucket = 'course-images') {
  const split_ = url.split('/');
  const filename = split_[split_.length - 1];
  const bucket = await bucketFactory(_bucket);
  return bucket.file(filename).delete();
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
  checkFile,
  getFilePath,
  deleteFileGcs,
  isVideo,
  generateUploadUrl,
  getSignedUrl,
  uploadVideo
};
