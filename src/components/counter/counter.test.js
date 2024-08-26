import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './counter';

describe( 'Counter Component', () => {
	const setup = {
		threads: {
			maxChars: 500,
			api: 'https://threads.net/intent/post?text=',
		},
		x: {
			maxChars: 279, // X adds a space
			api: 'https://x.com/intent/tweet?text=',
		},
		reddit: {
			maxChars: 300,
			api: 'https://www.reddit.com/submit?title=',
		},
	};
	const setupArray = Object.entries( setup ).map(
		( [ name, { maxChars, api } ] ) => [ name, maxChars, api ]
	);

	test( 'Handles wrong socialNetwork correctly', () => {
		const shareString = setup.threads.api + 'Just a test';

		render(
			<Counter shareString={ shareString } socialNetwork="twitter" />
		);
		expect( screen.getByRole( 'status' ) ).toHaveTextContent( 'NaN' );
	} );

	test.each( setupArray )(
		'Maximum letters on empty string for %s',
		( socialNetwork, maxChars ) => {
			render(
				<Counter shareString="" socialNetwork={ socialNetwork } />
			);
			expect( screen.getByRole( 'status' ) ).toHaveTextContent(
				maxChars
			);
		}
	);

	test.each( setupArray )(
		'Counter works correctly "Hello World!" on %s',
		( socialNetwork, maxChars, api ) => {
			const post = 'Hello World!';
			const shareString = api + post;

			const availableChars = maxChars - post.length;

			render(
				<Counter
					shareString={ shareString }
					socialNetwork={ socialNetwork }
				/>
			);
			expect( screen.getByRole( 'status' ) ).toHaveTextContent(
				availableChars
			);
		}
	);

	test.each( setupArray )(
		'Counter works correctly too long Lorem Ipsum on %s',
		( socialNetwork, maxChars, api ) => {
			const message600 =
				'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu,';

			const shareString = api + encodeURIComponent( message600 );
			const availableChars = maxChars - 600;

			render(
				<Counter
					shareString={ shareString }
					socialNetwork={ socialNetwork }
				/>
			);
			expect( screen.getByRole( 'status' ) ).toHaveTextContent(
				availableChars
			);
			expect( screen.getByRole( 'status' ) ).toHaveClass( 'is-over' );
		}
	);

	test.each( setupArray )(
		'Counter works correctly Lorem Ipsum, Url and Author on %s',
		( socialNetwork, maxChars, api ) => {
			const message100 =
				'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean m';
			const postUrl = 'https://example.com/the-url-is-49-characters-long'; // 49 chars
			const author = 'by @testuser24'; // 14 chars

			const post = `${ message100 } ${ postUrl } ${ author }`;
			const shareString = api + encodeURIComponent( post );

			let availableChars;
			if ( socialNetwork === 'x' ) {
				availableChars = maxChars - 100 - 23 - 14 - 2; // message, X url at 23 chars, author and 2 spaces
			} else {
				availableChars = maxChars - 100 - 49 - 14 - 2; // message, url, author and 2 spaces
			}

			render(
				<Counter
					shareString={ shareString }
					socialNetwork={ socialNetwork }
				/>
			);
			expect( screen.getByRole( 'status' ) ).toHaveTextContent(
				availableChars
			);
		}
	);
} );
