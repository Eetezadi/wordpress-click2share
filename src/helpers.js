/**
 *
 * Helper Functions to keep main Code lean
 *
 */

// Import Libraries
import apiFetch from '@wordpress/api-fetch';

/**
 * Fetches the permalink or shortlink for the current post.
 *
 * @param {boolean} useShortlink - Whether to fetch the shortlink (1) or the permalink.
 * @return {Promise<string>} - A promise that resolves to the link.
 */
export const fetchPageLink = async ( useShortlink ) => {
	const postId = wp.data.select( 'core/editor' ).getCurrentPostId();

	if ( ! postId ) {
		throw new Error( 'No post ID available.' );
	}

	// Get post data from Wordpress API
	const post = await apiFetch( { path: `/wp/v2/posts/${ postId }` } );

	// Custom endpoints defined in the c2sh-api_endpoints.php
	const pageLink =
		useShortlink === 1 ? post.c2sh_shortlink : post.c2sh_permalink;

	return pageLink;
};

/**
 * Fetches the Click 2 Share settings from the WordPress REST API.
 * @return {Promise<Object|null>} The settings object if fetched successfully, otherwise null.
 */
export const fetchSettings = async () => {
	try {
		const response = await fetch( '/wp-json/c2sh/settings' );

		if ( ! response.ok ) {
			throw new Error(
				`Network response was not ok: ${ response.statusText }`
			);
		}

		const data = await response.json();
		return data;
	} catch ( error ) {
		return null;
	}
};

/**
 * Sets default attributes based on fetched settings.
 *
 * @param {Object} attributes - Current block attributes.
 * @param {Function} setAttributes - Function to set block attributes.
 * @param {Object} settings - Settings object fetched from the API.
 * @return {Object} - Updated attributes with defaults applied.
 */
export const applyDefaultAttributes = async (
	attributes,
	setAttributes,
	settings
) => {
	const updatedAttributes = {
		socialNetwork:
			attributes.socialNetwork || settings.default_socialNetwork,
		linkLabel: attributes.linkLabel || settings.default_linkLabel,
		userName: attributes.userName || settings.default_userName,
		theme: attributes.theme || settings.default_theme,
		useShortlink: attributes.useShortlink || settings.default_useShortlink,
	};

	// Set pageLink
	updatedAttributes.pageLink =
		attributes.pageLink ||
		( await fetchPageLink( updatedAttributes.useShortlink ) );

	setAttributes( updatedAttributes );
	return updatedAttributes;
};
