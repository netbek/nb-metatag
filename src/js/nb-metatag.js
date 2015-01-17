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
				if (arguments.length > 1) {
					set(config, arguments[0], arguments[1]);
				}
				else {
					config = angular.extend({}, config, values);
				}
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
	 * Set the value of a key in an array or object. Note that the array or object is modified.
	 *
	 * @param {object|array} obj
	 * @param {string} path Path to value, e.g. to set 'c' value of obj, use path 'a.b.c'
	 * @param {mixed} value
	 * @param {string} delimiter Path delimiter (default: .)
	 * @returns {object|array}
	 */
	function set (obj, path, value, delimiter) {
		if (angular.isUndefined(delimiter)) {
			delimiter = '.';
		}

		var keys = path.split(delimiter);
		var len = keys.length - 1;
		var parent = obj;

		for (var i = 0; i < len; i++) {
			var key = keys[i];

			if (angular.isUndefined(parent[key]) || !angular.isObject(parent[key])) {
				if (isNaN(keys[i + 1])) {
					parent[key] = {};
				}
				else {
					parent[key] = [];
				}
			}

			parent = parent[key];
		}

		parent[keys[len]] = value;

		return obj;
	}
})(window, window.angular);
