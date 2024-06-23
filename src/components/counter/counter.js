/**
 * Calculates the remaining chars for Meta Threads
 * Adds class "is-over" if over limit
 *
 * @param {string} shareURL - Computed url for the Threads API
 * @return {JSX.Element} Element to render.
 */

// CSS Styles
import './counter.scss';

export default function Counter( { shareURL, socialNetwork } ) {
	const maxChars = {
		threads: 500,
		x: 280,
		reddit: 300,
	};

	const countString = shareURL
		? decodeURIComponent( shareURL.split( '=', 2 )[ 1 ] )
		: ''; // countString not initialized on first call

	let postLength = countString.length;

	// X shortens URLs automatically to 23 chars and adds a space at the end
	if ( socialNetwork === 'x' ) {
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const extractedUrl = countString.match( urlRegex );
		const extractedUrlLength = extractedUrl ? extractedUrl[ 0 ].length : 0;

		postLength =
			extractedUrlLength > 0
				? countString.length - extractedUrlLength + 23 + 1 // adjust for shortened url and add space
				: countString.length + 1; // adjust for space
	}

	const remainingChars = maxChars[ socialNetwork ] - postLength;

	const defaulClass = 'wp-block-eetezadi-click2share-counter';
	const highlightClass = remainingChars < 0 ? ' is-over' : ''; // add highlight

	return (
		<span className={ `${ defaulClass }${ highlightClass }` }>
			{ remainingChars }
		</span>
	);
}
