const forbiddenValues = [null, undefined, '']

export default function checkValues(arrayOfObjects, fieldsToCheck) {
  for (let i = 0; i < arrayOfObjects.length; i++) {
    const data = arrayOfObjects[i]
    const cardKeys = Object.keys(data)
    for (let j = 0; j < fieldsToCheck.length; j++) {
      const value = data[fieldsToCheck[j]]
      if (!cardKeys.includes(fieldsToCheck[j]) || forbiddenValues.includes(value)) {
        return fieldsToCheck[j]
      }
    }
  }
  return ''
}