import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ContentEditor from './contenteditor';

describe( 'Content Editor Component', () => {
	const mockSetAttributes = jest.fn();

	test( 'User can type into the box', async () => {
		const user = userEvent.setup();
		const oldText = 'Hello';
		const newText = ' World !';

		render(
			<ContentEditor
				post={ oldText }
				setAttributes={ mockSetAttributes }
			/>
		);

		const textbox = screen.getByRole( 'textbox' );

		expect( textbox ).toBeInTheDocument();
		expect( textbox ).toHaveTextContent( oldText );

		await user.type( textbox, newText );
		expect( textbox ).toHaveTextContent( oldText + newText );
	} );

	test( 'Matches the Snapshot', () => {
		const text = 'I want to share this on Social Media!';

		const { asFragment } = render(
			<ContentEditor post={ text } setAttributes={ mockSetAttributes } />
		);

		expect( asFragment() ).toMatchSnapshot();
	} );
} );
