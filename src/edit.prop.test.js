import { render } from '@testing-library/react';
import Edit from './edit';
import Sidebar from './components/sidebar/sidebar';
import ContentEditor from './components/contenteditor/contenteditor';
import Counter from './components/counter/counter';
import Sharelink from './components/sharelink/sharelink';

// Scoped Mocking
jest.mock( './components/sidebar/sidebar', () =>
	jest.fn( () => <div>Sidebar Mock</div> )
);
jest.mock( './components/contenteditor/contenteditor', () =>
	jest.fn( () => <div>ContentEditor Mock</div> )
);
jest.mock( './components/counter/counter', () =>
	jest.fn( () => <div>Counter Mock</div> )
);
jest.mock( './components/sharelink/sharelink', () =>
	jest.fn( () => <div>Sharelink Mock</div> )
);

describe( 'Edit Component - Prop Validation', () => {
	const attributes = {
		post: 'Sample post',
		pageLink: 'https://example.com',
		linkLabel: 'Click here',
		userName: 'user123',
		socialNetwork: 'Threads',
		shareString: 'This is a share string',
		theme: 'light',
		useShortlink: 1,
	};
	const setAttributes = jest.fn();

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	test( 'Sidebar is called with correct props', () => {
		render(
			<Edit attributes={ attributes } setAttributes={ setAttributes } />
		);

		expect( Sidebar ).toHaveBeenCalledWith(
			expect.objectContaining( {
				linkLabel: attributes.linkLabel,
				pageLink: attributes.pageLink,
				userName: attributes.userName,
				socialNetwork: attributes.socialNetwork,
				setAttributes,
			} ),
			{}
		);
	} );

	test( 'ContentEditor is called with correct props', () => {
		render(
			<Edit attributes={ attributes } setAttributes={ setAttributes } />
		);

		expect( ContentEditor ).toHaveBeenCalledWith(
			expect.objectContaining( {
				post: attributes.post,
				setAttributes,
			} ),
			{}
		);
	} );

	test( 'Counter is called with correct props', () => {
		render(
			<Edit attributes={ attributes } setAttributes={ setAttributes } />
		);

		expect( Counter ).toHaveBeenCalledWith(
			expect.objectContaining( {
				shareString: attributes.shareString,
				socialNetwork: attributes.socialNetwork,
			} ),
			{}
		);
	} );

	test( 'Sharelink is called with correct props', () => {
		render(
			<Edit attributes={ attributes } setAttributes={ setAttributes } />
		);

		expect( Sharelink ).toHaveBeenCalledWith(
			expect.objectContaining( {
				post: attributes.post,
				pageLink: attributes.pageLink,
				userName: attributes.userName,
				linkLabel: attributes.linkLabel,
				shareString: attributes.shareString,
				socialNetwork: attributes.socialNetwork,
				setAttributes,
			} ),
			{}
		);
	} );
} );
