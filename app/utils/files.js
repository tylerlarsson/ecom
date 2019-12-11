export const getFileName = url => {
  const re = /(?:.+\/)(.+)/gim;
  const filename = url.replace(re, '$1');
  return filename;
};

export const toDataURL = url =>
  fetch(url)
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob));
