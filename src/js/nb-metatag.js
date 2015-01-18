/**
 * AngularJS service for meta tags
 *
 * @author Hein Bekker <hein@netbek.co.za>
 * @copyright (c) 2015 Hein Bekker
 * @license http://www.gnu.org/licenses/agpl-3.0.txt AGPLv3
 */

(function (window, angular, undefined) {
	'use strict';

	angular
		.module('nb.metatag', [
			'nb.lodash',
			'nb.token'
		])
		.provider('nbMetatag', nbMetatag)
		.provider('nbMetatagConfig', nbMetatagConfig);

	function nbMetatagConfig () {
		var config = {
			delimiter: ':', // Meta tag path delimiter
			defaults: {
				title: undefined,
				abstract: undefined,
				description: undefined,
				keywords: undefined,
				copyright: undefined,
				og: {
					title: undefined,
					description: undefined,
					url: undefined,
					type: undefined,
					image: {
						facebook: {
							url: undefined,
							width: undefined,
							height: undefined
						},
						linkedin: {
							url: undefined,
							width: undefined,
							height: undefined
						}
					}
				},
				twitter: {
					card: undefined,
					site: undefined,
					creator: undefined,
					image: undefined
				},
				mobile_web_app_capable: undefined,
				apple_mobile_web_app_capable: undefined,
				apple_mobile_web_app_title: undefined
			}
		};
		return {
			set: function (values) {
				config = extend(true, {}, config, values);
			},
			$get: function () {
				return config;
			}
		};
	}

	function nbMetatag () {
		var initialized = false;

		return {
			$get: ['$rootScope', '$q', 'nbToken', 'nbMetatagConfig', '_',
				function ($rootScope, $q, nbToken, nbMetatagConfig, _) {
					// Bind events.
					$rootScope.$on('$stateChangeStart', function () {
						reset();
					});

					/**
					 * Resets metatags to default values.
					 */
					function reset () {
						$rootScope.metatag = nbToken.replace(_.cloneDeep(nbMetatagConfig.defaults));
					}

					return {
						/**
						 *
						 * @returns {promise}
						 */
						init: function () {
							var d = $q.defer();

							if (!initialized) {
								initialized = true;
								reset();
							}

							d.resolve(true);

							return d.promise;
						},
						reset: reset,
						/**
						 *
						 * @param {obj} obj
						 */
						set: function (obj) {
							$rootScope.metatag = nbToken.replace(obj);
						}
					};
				}]
		};
	}

	/**
	 * Checks if value is an object created by the Object constructor.
	 *
	 * @param {mixed} value
	 * @returns {Boolean}
	 */
	function isPlainObject (value) {
		return (!!value && typeof value === 'object' && value.constructor === Object
			// Not DOM node
			&& !value.nodeType
			// Not window
			&& value !== value.window);
	}

	/**
	 * Merge the contents of two or more objects together into the first object.
	 *
	 * Shallow copy: extend({}, old)
	 * Deep copy: extend(true, {}, old)
	 *
	 * Based on jQuery (MIT License, (c) 2014 jQuery Foundation, Inc. and other contributors)
	 */
	function extend () {
		var options, key, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === 'boolean') {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (!isPlainObject(target) && !angular.isFunction(target)) {
			target = {};
		}

		// If only one argument is passed
		if (i === length) {
			i--;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {
				// Extend the base object
				for (key in options) {
					src = target[key];
					copy = options[key];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = angular.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && angular.isArray(src) ? src : [];
						}
						else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[key] = extend(deep, clone, copy);
					}
					// Don't bring in undefined values
					else if (copy !== undefined) {
						target[key] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	}
})(window, window.angular);
