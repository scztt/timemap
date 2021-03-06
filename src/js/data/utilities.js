/**
  * Get URI params to start with predefined set of
  * https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  * @param {string} name: name of paramater to search
  * @param {string} url: url passed as variable, defaults to window.location.href
  */
export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, `\\$&`);

  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Compare two arrays of scalars
 * @param {array} arr1: array of numbers
 * @param {array} arr2: array of numbers
 */
export function areEqual(arr1, arr2) {
    return ((arr1.length === arr2.length) && arr1.every((element, index) => {
        return element === arr2[index];
    }));
}

/**
* Return whether the variable is neither null nor undefined
* @param {object} variable
*/
export function isNotNullNorUndefined(variable) {
  return (typeof variable !== 'undefined' && variable !== null);
}
