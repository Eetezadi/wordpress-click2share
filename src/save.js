/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	const {
		post,
		linkLabel,
		shareString,
		backgroundColor,
		textColor,
		className,
	} = attributes;

	return (
		<div
			className={ `${ className } wp-c2t-block-wrapper` }
			style={ {
				backgroundColor: backgroundColor,
			} }
		>
			<RichText.Content
				tagName="p"
				value={ post }
				class="wp-c2t-block-post"
				style={ {
					color: textColor,
				} }
			/>
			<div class="wp-c2t-block-footer">
				<span class="wp-c2t-block-icon"></span>
				<a
					class="wp-c2t-block-link"
					href={ shareString }
					target="_blank"
					rel="noopener"
				>
					{ linkLabel }
				</a>
			</div>
		</div>
	);
}
