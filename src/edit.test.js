import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Edit from './edit';

import { fetchSettings, applyDefaultAttributes } from './helpers';
jest.mock( './helpers', () => ( {
	fetchSettings: jest.fn(),
	applyDefaultAttributes: jest.fn(),
} ) );

describe( 'Edit component - General Validation', () => {
	// Default Attributes to be called
	const defaultAttributes = {
		post: 'Test post content',
		pageLink: undefined,
		linkLabel: '',
		userName: '',
		socialNetwork: 'threads', // import for rendering Sharelink component
		shareString: '',
		theme: 'light',
		useShortlink: false,
	};
	const mockSetAttributes = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	test( 'Main components are present in block', () => {
		render(
			<Edit
				attributes={ defaultAttributes }
				setAttributes={ mockSetAttributes }
			/>
		);

		const blockWrapper = screen.getByRole( 'document' );
		expect( blockWrapper ).toBeInTheDocument();

		const textBox = screen.getByRole( 'textbox' );
		expect( textBox ).toBeInTheDocument();
		expect( textBox ).toHaveTextContent( defaultAttributes.post );

		const counter = screen.getByRole( 'status' );
		expect( counter ).toBeInTheDocument();
		expect( counter ).toHaveClass(
			'wp-block-eetezadi-click2share-counter'
		);

		const shareLink = screen.getByRole( 'link' );
		expect( shareLink ).toBeInTheDocument();
		expect( shareLink ).toHaveClass(
			'wp-block-eetezadi-click2share-sharelink'
		);
	} );

	test( 'UseEffect Helper Init functions are called on initialization', async () => {
		fetchSettings.mockResolvedValue( {
			theme: 'dark',
			useShortlink: true,
		} );

		render(
			<Edit
				attributes={ defaultAttributes }
				setAttributes={ mockSetAttributes }
			/>
		);

		await waitFor( () => {
			expect( fetchSettings ).toHaveBeenCalled();
			expect( applyDefaultAttributes ).toHaveBeenCalledWith(
				defaultAttributes,
				mockSetAttributes,
				{ theme: 'dark', useShortlink: true }
			);
		} );
	} );

	test( 'Default theme applied', async () => {
		render(
			<Edit
				attributes={ defaultAttributes }
				setAttributes={ mockSetAttributes }
			/>
		);
		expect( mockSetAttributes ).toHaveBeenCalledWith( {
			className: 'is-style-light',
		} );
	} );

	test( 'Dark theme applied', async () => {
		const darkThemeAttributes = { ...defaultAttributes, theme: 'dark' };
		render(
			<Edit
				attributes={ darkThemeAttributes }
				setAttributes={ mockSetAttributes }
			/>
		);
		expect( mockSetAttributes ).toHaveBeenCalledWith( {
			className: 'is-style-dark',
		} );
	} );

	test( 'Matches the Snapshot', () => {
		const { asFragment } = render(
			<Edit
				attributes={ defaultAttributes }
				setAttributes={ mockSetAttributes }
			/>
		);
		expect( asFragment() ).toMatchSnapshot();
	} );
} );
