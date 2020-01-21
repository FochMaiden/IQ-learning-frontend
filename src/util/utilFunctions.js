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
