/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	RichText,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';

import {
	TextControl,
	PanelBody,
	PanelRow,
	ExternalLink,
} from '@wordpress/components';

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
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const blockProps = useBlockProps();

	// Initialize attributes
	const {
		post,
		pageLink,
		linkLabel,
		userName,
		shareString,
		defaultStyle,
		backgroundColor,
		textColor,
		className,
	} = attributes;

	// Initialize sharedString
	const updateShareString = ( newPost, newPageLink, newUserName ) => {
		newPageLink = newPageLink ? ' ' + newPageLink : '';
		newUserName = userName ? ' by @' + userName : '';

		const encodedText = encodeURIComponent(
			newPost + newPageLink + newUserName
		);
		const newShareString =
			'https://threads.net/intent/post?text=' + encodedText;

		setAttributes( { shareString: newShareString } );
	};
	updateShareString( post, pageLink ); // set default

	// Change functions
	const onChangePost = ( newPost ) => {
		setAttributes( { post: newPost } );
		updateShareString( newPost, pageLink );
	};

	const onChangePageLink = ( newPageLink ) => {
		setAttributes( { pageLink: newPageLink } );
	};
	const onChangeLinkLabel = ( newLinkLabel ) => {
		setAttributes( {
			linkLabel: newLinkLabel,
		} );
	};
	const onChangeUserName = ( newUserName ) => {
		setAttributes( { userName: newUserName } );
	};

	const onChangeBackgroundColor = ( newBackgroundColor ) => {
		setAttributes( { backgroundColor: newBackgroundColor } );
	};
	const onChangeTextColor = ( newTextColor ) => {
		setAttributes( { textColor: newTextColor } );
	};
	const onChangeClassName = ( newClassName ) => {
		setAttributes( { className: newClassName } );
	};

	// Initialize pageLink
	if ( pageLink === undefined ) {
		const { select } = wp.data;
		const defaultPageLink = select( 'core/editor' ).getCurrentPost().link;
		onChangePageLink( defaultPageLink );
	}

	// Initialize className
	if ( className === undefined ) {
		const defaultClassName = 'is-style-' + defaultStyle;
		onChangeClassName( defaultClassName );
	}

	return (
		<div
			{ ...blockProps }
			style={ {
				backgroundColor: backgroundColor,
			} }
		>
			<InspectorControls>
				<PanelBody
					title={ __( 'Link Settings', 'click2threads' ) }
					initialOpen={ true }
				>
					<PanelRow>
						<fieldset>
							<TextControl
								label={ __( 'Link label', 'click2threads' ) }
								value={ linkLabel }
								onChange={ onChangeLinkLabel }
								help={ __(
									'Caption of the share link.',
									'click2threads'
								) }
							/>
						</fieldset>
					</PanelRow>

					<PanelRow>
						<fieldset>
							<TextControl
								label={ __( 'Shared Link', 'click2threads' ) }
								value={ pageLink }
								onChange={ onChangePageLink }
								help={ __(
									'Optional: Link to be shared (default: post url)',
									'click2threads'
								) }
							/>
						</fieldset>
					</PanelRow>

					<PanelRow>
						<fieldset>
							<TextControl
								label={ __( 'Threads User', 'click2threads' ) }
								value={ userName }
								onChange={ onChangeUserName }
								help={ __(
									'Optional: Adds "by @username" to the post',
									'click2threads'
								) }
							/>
						</fieldset>
					</PanelRow>
				</PanelBody>
				<PanelBody
					title={ __( 'Custom Colors', 'click2threads' ) }
					initialOpen={ false }
				>
					<PanelColorSettings
						title={ __( 'Color settings', 'click2threads' ) }
						initialOpen={ true }
						colorSettings={ [
							{
								value: textColor,
								onChange: onChangeTextColor,
								label: __( 'Text color', 'click2threads' ),
							},
							{
								value: backgroundColor,
								onChange: onChangeBackgroundColor,
								label: __(
									'Background color',
									'click2threads'
								),
							},
						] }
					/>
				</PanelBody>
			</InspectorControls>
			<RichText
				tagName="p"
				onChange={ onChangePost }
				value={ post }
				allowedFormats={ [] }
				placeholder={ __( 'Write your Threads post...' ) }
				style={ {
					color: textColor,
				} }
			/>
			<ExternalLink href={ shareString }>{ linkLabel }</ExternalLink>
		</div>
	);
}
