/**
 * Calculates the remaining chars for Meta Threads
 * Adds class "is-over" if over limit
 *
 * @param {string} shareURL - Computed url for the Threads API
 * @return {JSX.Element} Element to render.
 */

// CSS Styles
import './counter.scss';

export default function Counter( { shareURL } ) {
	const maxChars = 500; //Threads limit
	const countString = shareURL
		? decodeURIComponent( shareURL.split( '=', 2 )[ 1 ] )
		: ''; // shareString not initialized on first call
	const remainingChars = maxChars - countString.length;

	const defaulClass = 'wp-block-eetezadi-click2share-counter';
	const highlightClass = remainingChars < 0 ? ' is-over' : ''; // add highlight

	return (
		<span className={ `${ defaulClass }${ highlightClass }` }>
			{ remainingChars }
		</span>
	);
}
