/**
 * Renders the block sidebar controls and handles change
 *
 * @param {string} linkLabel - Label for the link to be shared.
 * @param {string} pageLink - Link to be shared on Threads.
 * @param {string} userName - User name added as "via @username"
 * @param {string} textColor - Text color.
 * @param {string} backgroundColor - Background color.
 * @param {Function} setAttributes - Function to set attributes.
 * @return {JSX.Element} Element to render.
 */

// Translations
import { __ } from '@wordpress/i18n';

import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';

import { TextControl, PanelBody, PanelRow } from '@wordpress/components';

export default function Sidebar( {
	linkLabel,
	pageLink,
	userName,
	textColor,
	backgroundColor,
	setAttributes,
} ) {
	// Handle changes
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

	return (
		<InspectorControls>
			<PanelBody
				title={ __( 'Link Settings', 'click2share' ) }
				initialOpen={ true }
			>
				<PanelRow>
					<fieldset>
						<TextControl
							label={ __( 'Link label', 'click2share' ) }
							value={ linkLabel }
							onChange={ onChangeLinkLabel }
							help={ __(
								'Caption of the share link.',
								'click2share'
							) }
						/>
					</fieldset>
				</PanelRow>

				<PanelRow>
					<fieldset>
						<TextControl
							label={ __( 'Shared Link', 'click2share' ) }
							value={ pageLink }
							onChange={ onChangePageLink }
							help={ __(
								'Optional: Link to be shared (default: post url)',
								'click2share'
							) }
						/>
					</fieldset>
				</PanelRow>

				<PanelRow>
					<fieldset>
						<TextControl
							label={ __( 'Threads User', 'click2share' ) }
							value={ userName }
							onChange={ onChangeUserName }
							help={ __(
								'Optional: Adds "by @username" to the post',
								'click2share'
							) }
						/>
					</fieldset>
				</PanelRow>
			</PanelBody>
			<PanelBody
				title={ __( 'Custom Colors', 'click2share' ) }
				initialOpen={ false }
			>
				<PanelColorSettings
					title={ __( 'Color settings', 'click2share' ) }
					initialOpen={ true }
					colorSettings={ [
						{
							value: textColor,
							onChange: onChangeTextColor,
							label: __( 'Text color', 'click2share' ),
						},
						{
							value: backgroundColor,
							onChange: onChangeBackgroundColor,
							label: __( 'Background color', 'click2share' ),
						},
					] }
				/>
			</PanelBody>
		</InspectorControls>
	);
}
