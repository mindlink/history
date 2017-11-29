var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import resolvePathname from 'resolve-pathname';
import valueEqual from 'value-equal';
import { parsePath } from './PathUtils';

export var createLocation = function createLocation(path, state, key, currentLocation, useRawPathname) {
  var location = void 0;
  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = _extends({}, path);

    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  if (!useRawPathname) {
    try {
      location.pathname = decodeURI(location.pathname);
    } catch (e) {
      if (!(e instanceof URIError)) {
        throw e;
      }
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
};

export var safeDecodeURI = function safeDecodeURI(path) {
  try {
    return decodeURI(path);
  } catch (e) {
    return path;
  }
};

export var locationsAreEqual = function locationsAreEqual(a, b) {
  return safeDecodeURI(a.pathname) === safeDecodeURI(b.pathname) && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
};