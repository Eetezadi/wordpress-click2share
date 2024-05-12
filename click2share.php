<?php

/**
 * Plugin Name:       Click 2 Share
 * Description:       Gutenberg Block that displays a one-click shareable post for Social Media like Meta Threads.
 * Requires at least: 6.1 
 * Requires PHP:      7.0
 * Version:           1.1.4
 * Author:            Sina Eetezadi
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       click-2-share
 *
 * @package           create-block
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

// Set Defaults on Activation
function c2sh_set_default_options() {
    add_option('c2sh_default_linklabel', 'Share to Threads!');
    add_option('c2sh_default_username', '');
    add_option('c2sh_default_style', 'light');
}
register_activation_hook(__FILE__, 'c2sh_set_default_options');

// Plugin Settings
// CAVE: needs "npm run build:copy-php" need to be run, in order to be copied from src to build directory (s. package.json)
include_once(plugin_dir_path(__FILE__) . './c2sh-settings.php');

function click2share_block_init()
{
    // Loads block.json
    $block_config = json_decode(file_get_contents(__DIR__ . '/build/block.json'), true);

    // Retrieve defaults from WP settings
    $default_linklabel = get_option('c2sh_default_linklabel'); // Label for share link. Default: "Share 2 Threads"
    $default_username = get_option('c2sh_default_username', ''); // optional: username to be added
    $default_style = get_option('c2sh_default_style'); // optional: default style "light"
    $defaults = array(
        'default_linkLabel' => array(
            'type' => 'string',
            'default' => $default_linklabel,
        ),
        'default_userName' => array(
            'type' => 'string',
            'default' => $default_username,
        ),
        'default_theme' => array(
            'type' => 'string',
            'default' => $default_style,
        ),

    );
    foreach ($defaults as $key => $value) {
        $block_config['attributes'][$key] = $value; // Merge into attributes
    }

    // Register the block type with merged attributes.
    register_block_type(__DIR__ . '/build', array(
        'attributes' => $block_config['attributes'],
    ));
}
add_action('init', 'click2share_block_init');

// Remove Defaults after uninstallation
function c2sh_block_uninstall() {
    // Delete options
    delete_option('c2sh_default_linklabel');
    delete_option('c2sh_default_username');
    delete_option('c2sh_default_style');
}
register_uninstall_hook(__FILE__, 'c2sh_block_uninstall');