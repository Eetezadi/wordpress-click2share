/**
 * Import Wordpress Components
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { fetchSettings, applyDefaultAttributes } from './helpers';

// Custom Components
import Sidebar from './components/sidebar/sidebar';
import ContentEditor from './components/contenteditor/contenteditor';
import Counter from './components/counter/counter';
import Sharelink from './components/sharelink/sharelink';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object} attributes - Attributes of the block from block.json or PHP (_default)
 * @param {string} attributes.post - Text of the Threads post
 * @param {string} attributes.pageLink - Link to be shared on Threads. Set default in Php or later in Sidepanel
 * @param {string} attributes.linkLabel - Label of the link to be shared. Set in sidepanel or default
 * @param {string} attributes.userName - Threads username get added as "via @username". Set in sidepanel or default
 * @param {string} attributes.socialNetwork - Social network for this block. Currently either Threads, X or Reddit.
 * @param {string} attributes.shareString - String ready to be shared to the Threads API
 * @param {string} attributes.theme - Theme string, either "light" or "dark". Set in sidepanel or default
 * @param {boolean} attributes.useShortlink - Whether to use shortlink
 * @param {Function} setAttributes - Function to set attributes.
 * @return {JSX.Element} Elements to render
 */
export default function Edit( { attributes, setAttributes } ) {
	// Set BlockProps
	const blockProps = useBlockProps();

	// Initialize all attributes
	const {
		post,
		pageLink,
		linkLabel,
		userName,
		socialNetwork,
		shareString,
		theme,
	} = attributes;

	/*
	 *  - Hydrates the attributes with default values from settings
	 *  - Set the pageLink via API calls to use WP functions
	 */
	useEffect( () => {
		const initializeBlock = async () => {
			const settings = await fetchSettings(); // helper function

			if ( settings ) {
				await applyDefaultAttributes(
					attributes,
					setAttributes,
					settings
				);
			}
		};
		initializeBlock();
	}, [] ); // ignore linter, array needs to be empty

	/**
	 * Initialize className from Styles
	 * Somewhat of a hack can be be probably solved better:
	 * The "styles" in the block.json adds class "is-style-xxx" to the block internally, but not in blockProps
	 * On block init "className" is undefined, so it gets filled with theme (from WP settings => default_theme)
	 * Then this somehow gets properly added to the list of classes of the block
	 *
	 * @param {string} blockProps.classname - all classes supplied to the block
	 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/
	 */
	if ( ! blockProps.className.includes( 'is-style' ) && theme ) {
		const defaultClassName = 'is-style-' + theme;
		setAttributes( { className: defaultClassName } );
	}

	return (
		<div { ...blockProps }>
			<Sidebar
				linkLabel={ linkLabel }
				pageLink={ pageLink }
				userName={ userName }
				socialNetwork={ socialNetwork }
				setAttributes={ setAttributes }
			></Sidebar>
			<ContentEditor
				post={ post }
				setAttributes={ setAttributes }
			></ContentEditor>
			<div className="wp-block-eetezadi-click2share-footer">
				<Counter
					shareString={ shareString }
					socialNetwork={ socialNetwork }
				></Counter>
				<Sharelink
					post={ post }
					pageLink={ pageLink }
					userName={ userName }
					linkLabel={ linkLabel }
					shareString={ shareString }
					socialNetwork={ socialNetwork }
					setAttributes={ setAttributes }
				></Sharelink>
			</div>
		</div>
	);
}
