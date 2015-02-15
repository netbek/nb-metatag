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
			'delimiter': ':', // Meta tag path delimiter
			'defaults': {
				'global': {
					'title': undefined,
					'abstract': undefined,
					'description': undefined,
					'keywords': undefined,
					'copyright': undefined,
					'og': {
						'title': undefined,
						'description': undefined,
						'url': undefined,
						'type': undefined,
						'image': {
							'facebook': {
								'url': undefined,
								'width': undefined,
								'height': undefined
							},
							'linkedin': {
								'url': undefined,
								'width': undefined,
								'height': undefined
							}
						}
					},
					'twitter': {
						'card': undefined,
						'site': undefined,
						'creator': undefined,
						'image': undefined
					},
					'mobile_web_app_capable': undefined,
					'apple_mobile_web_app_capable': undefined,
					'apple_mobile_web_app_title': undefined
				}
			}
		};
		return {
			set: function (values) {
				_.merge(config, values);
			},
			$get: function () {
				return config;
			}
		};
	}

	function nbMetatag () {
		var initialized = false;

		return {
			$get: ['$rootScope', '$q', 'nbToken', 'nbMetatagConfig',
				function ($rootScope, $q, nbToken, nbMetatagConfig) {
					// Bind events.
					$rootScope.$on('$stateChangeStart', function () {
						reset();
					});

					/**
					 * Resets metatags to default values.
					 */
					function reset () {
						$rootScope.metatag = nbToken.replace(_.merge({}, nbMetatagConfig.defaults.global));
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
})(window, window.angular);
