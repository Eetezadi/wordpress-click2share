import { render } from '@testing-library/react';
import Sharelink from './sharelink';

describe( 'Sharelink Component', () => {
	test.each( [
		[ 'threads', 'https://threads.net/intent/post?text=' ],
		[ 'x', 'https://x.com/intent/tweet?text=' ],
		[ 'reddit', 'https://www.reddit.com/submit?title=' ],
	] )(
		'Sharelink for %s renders according to snapshot',
		( socialNetwork, api ) => {
			const mockSetAttributes = jest.fn();

			const post = 'Hi there, I test my first Link...';
			const pageLink = 'https://example.com/blog/test-page';
			const userName = 'testuser';
			const content = encodeURIComponent(
				`${ post } ${ pageLink } by @${ userName }`
			);
			const shareString = api + content;

			const { asFragment } = render(
				<Sharelink
					post={ post }
					pageLink={ pageLink }
					userName={ userName }
					socialNetwork={ socialNetwork }
					linkLabel="Share it!"
					shareString={ shareString }
					setAttributes={ mockSetAttributes }
				/>
			);

			expect( asFragment() ).toMatchSnapshot();
		}
	);
} );
