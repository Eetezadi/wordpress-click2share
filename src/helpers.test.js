import {
	fetchPageLink,
	fetchSettings,
	applyDefaultAttributes,
} from './helpers';

// Import and mock dependencies
import apiFetch from '@wordpress/api-fetch';
jest.mock( '@wordpress/api-fetch' );

const postId = 123;

// Utility function to setup global.wp and global.fetch
const setupGlobalMocks = () => {
	global.wp = {
		data: {
			select: jest.fn().mockReturnValue( {
				getCurrentPostId: jest.fn().mockReturnValue( postId ),
			} ),
		},
	};
	global.fetch = jest.fn();
};

describe( 'HelpersJS: fetchPageLink Unit Tests', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		setupGlobalMocks();
	} );

	test( 'throws an error when no post ID is available', async () => {
		wp.data
			.select( 'core/editor' )
			.getCurrentPostId.mockReturnValue( false );

		await expect( fetchPageLink() ).rejects.toThrow(
			'No post ID available.'
		);
	} );

	// Test that shortlink and permalink are returned based on useShortlink
	// useshortlink is validated in settings.php to be either '1' or '0'
	test.each( [
		[ 'shortlink', 1, `http://example.com/?p=${ postId }` ],
		[ 'permalink', 0, 'http://example.com/2024/07/hello-world/' ],
	] )(
		'returns the %s correctly if shortlink is %s',
		async ( linkType, useShortlink, expectedLink ) => {
			const mockPost = {
				c2sh_shortlink: `http://example.com/?p=${ postId }`,
				c2sh_permalink: 'http://example.com/2024/07/hello-world/',
			};

			apiFetch.mockResolvedValue( mockPost );

			const result = await fetchPageLink( useShortlink );
			expect( result ).toBe( expectedLink );
			expect( apiFetch ).toHaveBeenCalledWith( {
				path: `/wp/v2/posts/${ postId }`,
			} );
		}
	);
} );

describe( 'HelpersJS: FetchSettings Unit Tests', () => {
	beforeEach( () => {
		jest.clearAllMocks();
		setupGlobalMocks(); // Set up fetch mock
	} );

	test( 'returns settings object as JSON', async () => {
		const mockData = { setting1: 'value1', setting2: 'value2' };

		fetch.mockResolvedValueOnce( {
			ok: true,
			json: async () => mockData,
		} );

		const result = await fetchSettings();

		expect( result ).toEqual( mockData );
		expect( fetch ).toHaveBeenCalledWith( '/wp-json/c2sh/settings' );
	} );

	test( 'returns null when the fetch response is not ok', async () => {
		fetch.mockResolvedValueOnce( {
			ok: false,
			statusText: 'Not Found',
		} );

		const result = await fetchSettings();

		expect( result ).toBeNull();
		expect( fetch ).toHaveBeenCalledWith( '/wp-json/c2sh/settings' );
	} );

	test( 'should return null when the fetch throws an error', async () => {
		fetch.mockRejectedValueOnce( new Error( 'Network Error' ) );

		const result = await fetchSettings();

		expect( result ).toBeNull();
		expect( fetch ).toHaveBeenCalledWith( '/wp-json/c2sh/settings' );
	} );
} );

describe( 'HelpersJS: applyDefaultAttributes Unit Tests', () => {
	let defaultAttributes, attributes, settings, setAttributes;

	beforeEach( () => {
		jest.clearAllMocks();
		setupGlobalMocks();

		// Mock apiFetch to return the expected post object structure
		const shortUrl = `http://example.com/?p=${ postId }`;
		const longUrl = 'http://example.com/2024/07/hello-world/';
		apiFetch.mockResolvedValue( {
			c2sh_shortlink: shortUrl,
			c2sh_permalink: longUrl,
		} );

		attributes = {
			socialNetwork: '',
			linkLabel: '',
			userName: '',
			theme: '',
			useShortlink: undefined,
			pageLink: '',
		};

		settings = {
			default_socialNetwork: 'X',
			default_linkLabel: 'CheckitOut',
			default_userName: 'Elon',
			default_theme: 'dark',
			default_useShortlink: 0,
		};

		defaultAttributes = {
			socialNetwork: settings.default_socialNetwork,
			linkLabel: settings.default_linkLabel,
			userName: settings.default_userName,
			theme: settings.default_theme,
			useShortlink: settings.default_useShortlink,
			pageLink: longUrl,
		};

		setAttributes = jest.fn();
	} );

	const applyDefaultsAndTest = async ( expectedResult ) => {
		const result = await applyDefaultAttributes(
			attributes,
			setAttributes,
			settings
		);
		expect( result ).toEqual( expectedResult );
		expect( setAttributes ).toHaveBeenCalledWith( result );
	};

	test( 'Applies default setting applied when not defined', async () => {
		await applyDefaultsAndTest( defaultAttributes ); // assertions are in here
	} );

	test( 'Provided attributes are not overwritten', async () => {
		attributes = {
			socialNetwork: 'Facebook',
			linkLabel: 'Like',
			userName: 'customUser',
			theme: 'light',
			useShortlink: 0,
			pageLink: 'http://example.com',
		};

		await applyDefaultsAndTest( attributes ); // assertions are in here
	} );
} );
