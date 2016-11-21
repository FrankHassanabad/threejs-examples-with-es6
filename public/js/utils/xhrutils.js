'use strict';

class XhrUtils { // eslint-disable-line no-unused-vars
  static onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2), '% downloaded');
    }
  }

  static onError(xhr) {
    console.log('Error with request:', xhr);
  }
}
