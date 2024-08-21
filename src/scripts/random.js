export function randomIntObject(object) {
  return Math.round(Math.random() * (Object.keys(object).length - 1))
}

export function randomEntry(data) {
  return data[randomIntObject(data)]
}
