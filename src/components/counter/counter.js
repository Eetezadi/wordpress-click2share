/**
 * Calculates the remaining chars for Meta Threads
 * Adds class "is-over" if over limit
 *
 * @param {string} shareString - URL to be shared to Social Network API
 * @param {string} socialNetwork Short of the Social Network selected in Settings
 * @return {JSX.Element} Element to render.
 */

// CSS Styles
import './counter.scss';

export default function Counter( { shareString, socialNetwork } ) {
	const maxChars = {
		threads: 500,
		x: 280,
		reddit: 300,
	};

	// String with the post content
	const postString = shareString
		? decodeURIComponent( shareString.split( '=', 2 )[ 1 ] )
		: ''; // postString not initialized on first call
	let postLength = postString.length;

	// X shortens URLs automatically to 23 chars and adds a space at the end
	if ( socialNetwork === 'x' ) {
		// Extract the Link posted within postString
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const extractedUrl = postString.match( urlRegex );
		const extractedUrlLength = extractedUrl ? extractedUrl[ 0 ].length : 0;

		// If there is an additional link in the post, substract it and add only 24 chars
		if ( extractedUrlLength > 0 ) {
			postLength = postLength - extractedUrlLength + 24;
		} else {
			postLength = postLength + 1; // That space
		}
	}

	const remainingChars = maxChars[ socialNetwork ]
		? maxChars[ socialNetwork ] - postLength
		: 'NaN';

	const defaulClass = 'wp-block-eetezadi-click2share-counter';
	const highlightClass = remainingChars < 0 ? ' is-over' : ''; // add highlight

	return (
		<span className={ `${ defaulClass }${ highlightClass }` } role="status">
			{ remainingChars }
		</span>
	);
}
