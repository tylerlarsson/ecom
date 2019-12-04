export const getFileName = url => {
  const  re = /(?:.+\/)(.+)/gim;
  const filename = url.replace(re, '$1');
  return filename;
}
