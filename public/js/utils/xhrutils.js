'use strict';

/**
 * Simple utils for console logging the onProgress and any onErrors that happen.
 */
class XhrUtils { // eslint-disable-line no-unused-vars
  /**
   * onProgress of the Xhr loading where it console logs the percent downloaded
   * @param {Object} xhr The xhr object
   * @return {void}
   */
  static onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2), '% downloaded');
    }
  }

  /**
   * onError of the Xhr loading where it console logs the error.
   * @param {Object} xhr The xhr object
   * @return {void}
   */
  static onError(xhr) {
    console.log('Error with request:', xhr);
  }
}
