<?php

/**
 * Plugin Name:       Click 2 Share
 * Description:       Gutenberg Block Plugin to display a shareable post on Meta Threads, X (formely Twitter) or Reddit.
 * Requires at least: 6.6 
 * Requires PHP:      8.0
 * Version:           1.3.2
 * Author:            Sina Eetezadi
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       click-2-share
 *
 * @package           create-block
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

/** Plugin Settings */

$plugin_basename = plugin_basename(__FILE__); // for passing to settings

// CAVE: USE build_plugin_zip.sh to properly copy into build
include_once(plugin_dir_path(__FILE__) . './c2sh-settings.php');
include_once(plugin_dir_path(__FILE__) . './c2sh-api_endpoints.php');

// Register Setting defaults, s. c2sh-settings.php
register_activation_hook(__FILE__, 'c2sh_set_defaults');

/** Initialize the Main Block */
function click2share_block_init() {
    register_block_type(__DIR__ . '/build');
}
add_action('init', 'click2share_block_init');


// Remove Defaults after uninstallation
function c2sh_block_uninstall() {
    delete_option('c2sh_settings');
}
register_uninstall_hook(__FILE__, 'c2sh_block_uninstall');


// CLEANUP old settings (from previous versions < 1.3.2)
function c2sh_cleanup_old_settings() {
    $old_settings = ['c2sh_default_socialnetwork', 'c2sh_default_linklabel', 'c2sh_default_username', 'c2sh_default_style', 'c2sh_use_shortlink'];
    foreach ($old_settings as $setting) {
        if (get_option($setting) !== false) {
            delete_option($setting);
        }
    }
}
add_action('admin_init', 'c2sh_cleanup_old_settings');
