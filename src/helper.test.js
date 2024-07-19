import { initPageLink } from './helpers'; // Adjust the path as necessary

// Import and mock dependencies
import apiFetch from '@wordpress/api-fetch';
jest.mock( '@wordpress/api-fetch' );

describe( 'HelperJS: initPageLink Unit Tests', () => {
	beforeEach( () => {
		jest.clearAllMocks();

		// Define a global wp object with default mocks.
		global.wp = {
			data: {
				select: jest.fn(),
			},
		};
		wp.data.select.mockReturnValue( {
			getCurrentPostId: jest.fn(), // this will be changed
		} );
	} );

	test( 'throws an error when no post ID is available', async () => {
		wp.data
			.select( 'core/editor' )
			.getCurrentPostId.mockReturnValue( false );

		await expect( initPageLink() ).rejects.toThrow(
			'No post ID available.'
		);
	} );

	// Test that shortlink and permalink are returned based on useShortlink
	// useshortlink is validated in settings.php to be either '1' or '0'
	const postId = 123;
	test.each( [
		[ 'shortlink', '1', `http://example.com/?p=${ postId }` ],
		[ 'permalink', '0', 'http://example.com/2024/07/hello-world/' ],
	] )(
		'returns the %s correctly if shortlink is %s',
		async ( linkType, useShortlink, expectedLink ) => {
			const mockPost = {
				c2sh_shortlink: `http://example.com/?p=${ postId }`,
				c2sh_permalink: 'http://example.com/2024/07/hello-world/',
			};

			wp.data
				.select( 'core/editor' )
				.getCurrentPostId.mockReturnValue( postId );
			apiFetch.mockResolvedValue( mockPost );

			const result = await initPageLink( useShortlink );
			expect( result ).toBe( expectedLink );
			expect( apiFetch ).toHaveBeenCalledWith( {
				path: `/wp/v2/posts/${ postId }`,
			} );
		}
	);
} );
