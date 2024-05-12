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
				title={ __( 'Link Settings', 'click-2-share' ) }
				initialOpen={ true }
			>
				<PanelRow>
					<fieldset>
						<TextControl
							label={ __( 'Link label', 'click-2-share' ) }
							value={ linkLabel }
							onChange={ onChangeLinkLabel }
							help={ __(
								'Caption of the share link.',
								'click-2-share'
							) }
						/>
					</fieldset>
				</PanelRow>

				<PanelRow>
					<fieldset>
						<TextControl
							label={ __( 'Shared Link', 'click-2-share' ) }
							value={ pageLink }
							onChange={ onChangePageLink }
							help={ __(
								'Optional: Link to be shared (default: post url)',
								'click-2-share'
							) }
						/>
					</fieldset>
				</PanelRow>

				<PanelRow>
					<fieldset>
						<TextControl
							label={ __( 'Threads User', 'click-2-share' ) }
							value={ userName }
							onChange={ onChangeUserName }
							help={ __(
								'Optional: Adds "by @username" to the post',
								'click-2-share'
							) }
						/>
					</fieldset>
				</PanelRow>
			</PanelBody>
			{/*
			
			!!! Temporary fix until proper implementation of custom colors !!!
			
			<PanelBody
				title={ __( 'Custom Colors', 'click-2-share' ) }
				initialOpen={ false }
			>
				<PanelColorSettings
					title={ __( 'Color settings', 'click-2-share' ) }
					initialOpen={ true }
					colorSettings={ [
						{
							value: textColor,
							onChange: onChangeTextColor,
							label: __( 'Text color', 'click-2-share' ),
						},
						{
							value: backgroundColor,
							onChange: onChangeBackgroundColor,
							label: __( 'Background color', 'click-2-share' ),
						},
					] }
				/>
			</PanelBody> */}
		</InspectorControls>
	);
}
