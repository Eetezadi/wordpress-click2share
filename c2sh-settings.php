<?php

/**
 * Click 2 Share Plugin Settings Page
 *
 * Sets the default in the WP options DB
 * 
 * Implements settings page using WordPress Settings API. It includes:
 * - Default Social Network: Threads, Reddit, X
 * - Default Link Label to Share
 * - Default Threads Username: Validates and stores a username.
 * - Default Style: Allows selection between 'light' and 'dark' themes.
 * - Use of Shortlink Checkbox
 *
 * @package Click2Share
 */

// Prevent direct access to the file
if (!defined('ABSPATH')) {
    exit;
}

// Function to set defaults, gets called via hook in main file
function c2sh_set_defaults() {
    $defaults = array(
        'default_socialNetwork' => 'threads',
        'default_linkLabel' => 'Share it!',
        'default_userName' => '',
        'default_theme' => 'light',
        'default_useShortlink' => 0,
    );

    $options = get_option('c2sh_settings');

    if ($options === false) {
        update_option('c2sh_settings', $defaults);
    } else {
        // Update only missing keys in existing options
        $options = wp_parse_args($options, $defaults);
        update_option('c2sh_settings', $options);
    }
}

// Register settings, sections, and fields
function c2sh_register_settings()
{
    // Register settings
    register_setting('c2sh_settings_group', 'c2sh_settings', 'c2sh_validate_settings');

    // Add settings section
    add_settings_section(
        'c2sh_settings_section',
        __('Click 2 Share Default Settings', 'click-2-share'),
        'c2sh_settings_section_callback',
        'c2sh'
    );

    // Add settings fields
    add_settings_field(
        'default_socialNetwork',
        __('Default Social Network', 'click-2-share'),
        'c2sh_default_socialnetwork_callback',
        'c2sh',
        'c2sh_settings_section'
    );
    
    add_settings_field(
        'default_linkLabel',
        __('Default Share Label', 'click-2-share'),
        'c2sh_default_linklabel_callback',
        'c2sh',
        'c2sh_settings_section'
    );

    add_settings_field(
        'default_userName',
        __('Default Threads Username', 'click-2-share'),
        'c2sh_default_username_callback',
        'c2sh',
        'c2sh_settings_section'
    );

    add_settings_field(
        'default_theme',
        __('Default Theme', 'click-2-share'),
        'c2sh_default_theme_callback',
        'c2sh',
        'c2sh_settings_section'
    );

    add_settings_field(
        'useShortLink',
        __('Use Shortlink', 'click-2-share'),
        'c2sh_use_shortlink_callback',
        'c2sh',
        'c2sh_settings_section'
    );
    
}
add_action('admin_init', 'c2sh_register_settings');

/** Settings Creation callbacks */
function c2sh_settings_section_callback()
{
    echo '<p>' . esc_html(__('Set the default  settings for new Click 2 Share blocks. Settings for each block can be changed in the Gutenberg sidepanel menu.', 'click-2-share')) . '</p>';
}

function c2sh_default_socialnetwork_callback()
{
    $options = get_option('c2sh_settings');
    $socialnetwork = $options['default_socialNetwork'] ?? 'threads'; // Default
    ?>
    <select id="default_socialnetwork" name="c2sh_settings[default_socialNetwork]">
        <option value="threads" <?php selected($socialnetwork, 'threads'); ?>>Threads</option>
        <option value="x" <?php selected($socialnetwork, 'x'); ?>>X</option>
        <option value="reddit" <?php selected($socialnetwork, 'reddit'); ?>>Reddit</option>
    </select>
    <?php
    echo '<p class="description">' . esc_html(__('Choose the default social network.', 'click-2-share')) . '</p>';
}

function c2sh_default_linklabel_callback()
{
    $options = get_option('c2sh_settings');
    $linklabel = $options['default_linkLabel'] ?? 'Share it!'; // Default
    echo '<input type="text" id="default_linklabel" name="c2sh_settings[default_linkLabel]" value="' . esc_attr($linklabel) . '"/>';
    echo '<p class="description">' . esc_html(__('Enter the default caption for the share label', 'click-2-share')) . '</p>';
}

function c2sh_default_username_callback()
{
    $options = get_option('c2sh_settings');
    $username = $options['default_userName'] ?? ''; // Default
    echo '<input type="text" id="default_username" name="c2sh_settings[default_userName]" value="' . esc_attr($username) . '"/>';
    echo '<p class="description">' . esc_html(__('Enter the default Threads username for new blocks (without @).', 'click-2-share')) . '</p>';
}


function c2sh_default_theme_callback()
{
    $options = get_option('c2sh_settings');
    $theme = $options['default_theme'] ?? 'light'; // Default
    echo '<select id="default_theme" name="c2sh_settings[default_theme]">
            <option value="light"' . selected(esc_attr($theme), 'light', false) . '>Light</option>
            <option value="dark"' . selected(esc_attr($theme), 'dark', false) . '>Dark</option>
          </select>';
    echo '<p class="description">' . esc_html(__('Choose between Light and Dark theme.', 'click-2-share')) . '</p>';
}

function c2sh_use_shortlink_callback()
{
    $options = get_option('c2sh_settings');
    $use_shortlink = $options['default_useShortlink'] ?? 0; // Default
    echo '<input type="checkbox" id="default_use_shortlink" name="c2sh_settings[default_useShortlink]" value="1" ' . checked(1, $use_shortlink, false) . '/>';
    echo '<p class="description">' . esc_html(__('Use the Wordpress short Link instead of the full link.', 'click-2-share')) . '</p>';
}


/** 
 * Settings Validation 
*/

function c2sh_validate_settings($input)
{
    $output = [];

    $valid_networks = ['threads', 'x', 'reddit'];
    $output['default_socialNetwork'] = in_array($input['default_socialNetwork'], $valid_networks) ? $input['default_socialNetwork'] : 'threads'; // Default

    $linklabel = trim($input['default_linkLabel']);
    if (empty($linklabel) || strlen($linklabel) > 80) {
        add_settings_error(
            'c2sh_settings',
            'default_linklabel_error',
            __('Invalid Share Label: 1-80 characters', 'click-2-share'),
            'error'
        );
        $linklabel = substr($linklabel, 0, 80);
    }
    $output['default_linkLabel'] = sanitize_text_field($linklabel);

    $username = trim($input['default_userName']);
    if (empty($username) || preg_match('/^(?![.])[a-zA-Z0-9._]{1,30}(?<!\.)$/', $username)) {
        $output['default_userName'] = sanitize_text_field($username);
    } else {
        add_settings_error('c2sh_settings', 'default_username_error', __('Invalid Threads Username: 1-30 characters, only letters, numbers, periods, and underscores', 'click-2-share'), 'error');
    }

    $valid_themes = ['light', 'dark'];
    $output['default_theme'] = in_array($input['default_theme'], $valid_themes) ? $input['default_theme'] : 'light'; // Default

    $output['default_useShortlink'] = isset($input['default_useShortlink']) ? 1 : 0; // Default

    return $output;
}

// Add the submenu page under the Settings menu
function c2sh_add_options_page()
{
    add_submenu_page(
        'options-general.php',
        __('Click 2 Share', 'click-2-share'),
        __('Click 2 Share', 'click-2-share'),
        'manage_options',
        'c2sh-settings',
        'c2sh_options_page_html'
    );
}
add_action('admin_menu', 'c2sh_add_options_page');

// Display the settings page content
function c2sh_options_page_html()
{
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // Admin page markup
?>
    <div class="c2sh-settings">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('c2sh_settings_group');
            do_settings_sections('c2sh');
            submit_button('Save');
            ?>
        </form>
    </div>
    <div class="c2sh-footer">
        <p><?php echo esc_html(__('Developed by', 'click-2-share')) . ' <strong>Sina Eetezadi</strong> ' . esc_html(__('blogging at', 'click-2-share')) . ' <a href="https://fasterbikeblog.com" target="_blank">Faster Bike Blog</a>.' . esc_html(__('The source code can be found on', 'click-2-share')) . ' <a href="https://github.com/eetezadi/wordpress-click2share" target="_blank">GitHub</a>.'; ?></p>
    </div>
    </div>
    <style>
        .c2sh-footer {
            padding-top: 20px;
            font-style: italic;
        }
    </style>
<?php
}

// Hook to add a settings link to the plugin overview
// $plugin_basename needs to be set in main plugin file
add_filter('plugin_action_links_' . $plugin_basename, 'c2sh_add_settings_link');

function c2sh_add_settings_link($links) {
    $settings_link = '<a href="' . esc_url(admin_url('options-general.php?page=c2sh-settings')) . '">Settings</a>';
    array_push($links, $settings_link);
    return $links;
}
