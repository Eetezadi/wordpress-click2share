<?php

/**
 * Plugin Name:       Click 2 Share
 * Description:       Gutenberg Block Plugin to display a shareable post on Meta Threads, X (formely Twitter) or Reddit.
 * Requires at least: 5.0 
 * Requires PHP:      7.0
 * Version:           1.3.1
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
    add_option('c2sh_default_socialnetwork', 'threads');
    add_option('c2sh_default_linklabel', 'Click to Share!');
    add_option('c2sh_default_username', '');
    add_option('c2sh_default_style', 'light');
    add_option('c2sh_use_shortlink', 0);    
}
register_activation_hook(__FILE__, 'c2sh_set_default_options');

/** Plugin Settings */

$plugin_basename = plugin_basename(__FILE__); // for passing to settings

// CAVE: USE build_plugin_zip.sh to properly copy into build
include_once(plugin_dir_path(__FILE__) . './c2sh-settings.php');
include_once(plugin_dir_path(__FILE__) . './c2sh-api_endpoints.php');


/** Initialize the Main Block */
function click2share_block_init()
{
    // Loads block.json
    $block_config = json_decode(file_get_contents(__DIR__ . '/build/block.json'), true);

    // Retrieve defaults from WP settings, where defaults are set in the validate functions
    $default_socialnetwork = get_option('c2sh_default_socialnetwork', 'threads'); // default: threads
    $default_linklabel = get_option('c2sh_default_linklabel', 'Click to Share!'); // default: "Click to Share!"
    $default_username = get_option('c2sh_default_username', ''); // optional: username to be added
    $default_style = get_option('c2sh_default_style', 'light'); // default style "light"
    $default_use_shortlink = get_option('c2sh_use_shortlink', 0); // default style 0, dont use
    $defaults = array(
        'default_socialNetwork' => array(
            'type' => 'string',
            'default' => $default_socialnetwork,
        ),
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
        'default_useShortlink' => array(
            'type' => 'boolean',
            'default' => $default_use_shortlink,
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
    delete_option('c2sh_default_socialnetwork');
    delete_option('c2sh_default_linklabel');
    delete_option('c2sh_default_username');
    delete_option('c2sh_default_style');
}
register_uninstall_hook(__FILE__, 'c2sh_block_uninstall');
