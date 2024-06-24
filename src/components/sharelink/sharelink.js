/**
 * Create the link to be shared to the Threads API
 *
 * @param {string} post - Post content.
 * @param {string} link - Link URL. Set in sidepanel or default.
 * @param {string} userName - User name added as "via @username"
 * @param {string} socialNetwork - Social network to be shared to
 * @param {string} linkLabel - Link label. Set in sidepanel or defaul
 * @param {string} shareString - Completed String to be saved.
 * @param {Function} setAttributes - Function to set attributes.
 * @return {JSX.Element} Element to render.
 */

// CSS Styles
import './sharelink.scss';

import { ExternalLink } from '@wordpress/components';
import SocialNetworkIcon from '../socialnetworkicon/socialnetworkicon';

export default function Sharelink( {
	post,
	link,
	userName,
	socialNetwork,
	linkLabel,
	shareString,
	setAttributes,
} ) {
	// API Setup
	const apiLinks = {
		threads: 'https://threads.net/intent/post?text=',
		x: 'https://x.com/intent/tweet?text=',
		reddit: 'https://www.reddit.com/submit?title=',
	};

	// Text styling
	post = post.trim();
	link = link ? ' ' + link : '';
	userName = userName ? ' by @' + userName : '';

	const encodedText = encodeURIComponent( post + link + userName );
	const newShareString = apiLinks[ socialNetwork ] + encodedText;

	setAttributes( { shareString: newShareString } );

	return (
		<ExternalLink
			className={ `wp-block-eetezadi-click2share-sharelink ${ socialNetwork }` }
			href={ shareString }
		>
			<SocialNetworkIcon socialNetwork={ socialNetwork } />
			{ linkLabel }
		</ExternalLink>
	);
}
