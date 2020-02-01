export function merge(a, b, prop) {
  let reduced = a.filter(
    aitem => !b.find(bitem => aitem[prop] === bitem[prop])
  );
  return reduced.concat(b);
}

export function sortItems(a, b) {
  const messsA = a.id;
  const messsB = b.id;

  if (messsA > messsB) {
    return 1;
  } else if (messsA < messsB) {
    return -1;
  }
}
export const dwnld = (resp, id) => {
  let pdf = b64toBlob(resp, '');

  const fileURL = URL.createObjectURL(pdf);
  const link = document.createElement('a');

  link.href = fileURL;
  link.download = 'Test ' + id + '.pdf';
  link.click();
};

export function b64toBlob(b64Data, contentType) {
  contentType = contentType || '';
  let sliceSize = 512;
  b64Data = b64Data.replace(/^[^,]+,/, '');
  b64Data = b64Data.replace(/\s/g, '');
  let byteCharacters = window.atob(b64Data);
  let byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  let blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
export function jebacto(url) {}

export const truncateString = (str, num) => {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}