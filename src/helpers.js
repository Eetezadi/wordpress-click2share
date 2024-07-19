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
export const initPageLink = async ( useShortlink ) => {
	const postId = wp.data.select( 'core/editor' ).getCurrentPostId();

	if ( ! postId ) {
		throw new Error( 'No post ID available.' );
	}

	// Get post data from Wordpress API
	const post = await apiFetch( { path: `/wp/v2/posts/${ postId }` } );

	// Custom endpoints defined in the c2sh-api_endpoints.php
	const pageLink =
		useShortlink === '1' ? post.c2sh_shortlink : post.c2sh_permalink;

	return pageLink;
};
