/**
 * Renders the block sidebar controls and handles change
 *
 * @param {string} linkLabel - Label for the link to be shared.
 * @param {string} pageLink - Link to be shared on Threads.
 * @param {string} userName - User name added as "via @username"
 * @param {string} socialNetwork - Social network to be shared to
 * @param {string} textColor - Text color.
 * @param {string} SocialNetwork - Background color.
 * @param {Function} setAttributes - Function to set attributes.
 * @return {JSX.Element} Element to render.
 */

// Translations
import { __ } from '@wordpress/i18n';

import { InspectorControls } from '@wordpress/block-editor';

import {
	TextControl,
	PanelBody,
	PanelRow,
	SelectControl,
} from '@wordpress/components';

export default function Sidebar( {
	linkLabel,
	pageLink,
	userName,
	socialNetwork,
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
	const onChangeSocialNetwork = ( newSocialNetwork ) => {
		setAttributes( { socialNetwork: newSocialNetwork } );
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

				<PanelRow>
					<fieldset>
						<SelectControl
							label={ __(
								'Select Social Network',
								'click-2-share'
							) }
							value={ socialNetwork }
							options={ [
								{ label: 'Threads', value: 'threads' },
								{ label: 'X', value: 'x' },
								{ label: 'Reddit', value: 'reddit' },
							] }
							onChange={ onChangeSocialNetwork }
							help={ __(
								'Choose the social network for sharing.',
								'click-2-share'
							) }
						/>
					</fieldset>
				</PanelRow>
			</PanelBody>
		</InspectorControls>
	);
}
