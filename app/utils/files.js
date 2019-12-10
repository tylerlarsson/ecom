export const getFileName = url => {
  const re = /(?:.+\/)(.+)/gim;
  const filename = url.replace(re, '$1');
  return filename;
};

export const toDataURL = (url) => {
  return fetch(url).then((response) => {
    return response.blob();
  }).then(blob => {
    return URL.createObjectURL(blob);
  });
}
