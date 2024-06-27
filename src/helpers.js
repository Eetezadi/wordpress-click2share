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
 * @param {boolean} useShortlink - Whether to fetch the shortlink (true) or the permalink (false).
 * @returns {Promise<string>} - A promise that resolves to the link.
 */
export const initPageLink = async (useShortlink) => {
    const postId = wp.data.select('core/editor').getCurrentPostId();

    if (!postId) {
        throw new Error('No post ID available.');
    }

    if (useShortlink == 1) {
        // Fetch shortlink
        const post = await apiFetch({ path: `/wp/v2/posts/${postId}?context=edit` });
        const shortlink = `${post.link.replace(/\/[^\/]*$/, '')}/?p=${post.id}`;
        return shortlink;
    } else {
        // Fetch permalink
        const post = await apiFetch({ path: `/wp/v2/posts/${postId}` });
        return post.link;
    }
};
