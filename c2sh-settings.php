<?php

/**
 * Click 2 Share Plugin Settings Page
 *
 * Implements settings page using WordPress Settings API. It includes:
 * - Default Threads Username: Validates and stores a username.
 * - Default Style: Allows selection between 'light' and 'dark' themes.
 *
 * @package Click2Share
 */

// Prevent direct access to the file
if (!defined('ABSPATH')) {
    exit;
}

// Register settings, sections, and fields
function c2sh_register_settings()
{
    // Register settings
    register_setting('c2sh_settings_group', 'c2sh_default_socialnetwork', 'c2sh_validate_socialnetwork');
    register_setting('c2sh_settings_group', 'c2sh_default_linklabel', 'c2sh_validate_linklabel');
    register_setting('c2sh_settings_group', 'c2sh_default_username', 'c2sh_validate_username');
    register_setting('c2sh_settings_group', 'c2sh_default_style', 'c2sh_validate_style');

    // Add settings section
    add_settings_section(
        'c2sh_settings_section',
        __('Click 2 Share Default Settings', 'click-2-share'),
        'c2sh_settings_section_callback',
        'c2t'
    );

    // Add settings fields
    add_settings_field(
        'c2sh_default_socialnetwork',
        __('Default Social Network', 'click-2-share'),
        'c2sh_default_socialnetwork_callback',
        'c2t',
        'c2sh_settings_section'
    );
    
    add_settings_field(
        'c2sh_default_linklabel',
        __('Default Share Label', 'click-2-share'),
        'c2sh_default_linklabel_callback',
        'c2t',
        'c2sh_settings_section'
    );

    add_settings_field(
        'c2sh_default_username',
        __('Default Threads Username', 'click-2-share'),
        'c2sh_default_username_callback',
        'c2t',
        'c2sh_settings_section'
    );

    add_settings_field(
        'c2sh_default_style',
        __('Default Theme', 'click-2-share'),
        'c2sh_default_style_callback',
        'c2t',
        'c2sh_settings_section'
    );
}
add_action('admin_init', 'c2sh_register_settings');

// Settings section callback
function c2sh_settings_section_callback()
{
    echo '<p>' . esc_html(__('Set the default  settings for new Click 2 Share blocks. Settings for each block can be changed in the Gutenberg sidepanel menu.', 'click-2-share')) . '</p>';
}

function c2sh_default_socialnetwork_callback()
{
    $socialnetwork = get_option('c2sh_default_socialnetwork');
    ?>
    <select id="c2sh_default_socialnetwork" name="c2sh_default_socialnetwork">
        <option value="threads" <?php selected($socialnetwork, 'threads'); ?>>Threads</option>
        <option value="x" <?php selected($socialnetwork, 'x'); ?>>X</option>
        <option value="reddit" <?php selected($socialnetwork, 'reddit'); ?>>Reddit</option>
    </select>
    <?php
    echo '<p class="description">' . esc_html(__('Choose the default social network.', 'click-2-share')) . '</p>';
}

function c2sh_default_linklabel_callback()
{
    $linklabel = get_option('c2sh_default_linklabel');
    echo '<input type="text" id="c2sh_default_linklabel" name="c2sh_default_linklabel" value="' . esc_attr($linklabel) . '"/>';
    echo '<p class="description">' . esc_html(__('Enter the default caption for the share label', 'click-2-share')) . '</p>';
}

function c2sh_default_username_callback()
{
    $username = get_option('c2sh_default_username');
    echo '<input type="text" id="c2sh_default_username" name="c2sh_default_username" value="' . esc_attr($username) . '"/>';
    echo '<p class="description">' . esc_html(__('Enter the default Threads username for new blocks (without @).', 'click-2-share')) . '</p>';
}


function c2sh_default_style_callback()
{
    $style = get_option('c2sh_default_style');
    echo '<select id="c2sh_default_style" name="c2sh_default_style">
            <option value="light"' . selected(esc_attr($style), 'light', false) . '>Light</option>
            <option value="dark"' . selected(esc_attr($style), 'dark', false) . '>Dark</option>
          </select>';
    echo '<p class="description">' . esc_html(__('Choose between Light and Dark theme.', 'click-2-share')) . '</p>';
}

function c2sh_validate_socialnetwork($input)
{
    $valid_networks = ['threads', 'x', 'reddit'];
    if (in_array($input, $valid_networks)) {
        return $input;
    }
    return 'threads'; // default value
}

function c2sh_validate_linklabel($input)
{
    $input = trim($input);
    $maxchar = 80; // arbitrary what fits in

    if (empty($input) || strlen($input) > $maxchar) {
        add_settings_error(
            'c2sh_default_linklabel',
            'c2sh_default_linklabel_error',
            __('Invalid Share Label: 1-80 characters', 'click-2-share'),
            'error'
        );
        $input = substr($input, 0, $maxchar);
    }
    return sanitize_text_field($input);
}

function c2sh_validate_username($input)
{
    $input = trim($input);

    // Check valid Instagram username if not empty
    if (!empty($input) && !preg_match('/^(?![.])[a-zA-Z0-9._]{1,30}(?<!\.)$/', $input)) {
        add_settings_error(
            'c2sh_default_username',
            'c2sh_default_username_error',
            __('Invalid Threads Username: 1-30 characters, only letters, numbers, periods, and underscores', 'click-2-share'),
            'error'
        );
    }
    return sanitize_text_field($input);
}

function c2sh_validate_style($input)
{
    $valid_styles = ['light', 'dark'];
    if (in_array($input, $valid_styles)) {
        return $input;
    }
    return 'light'; // default value
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
            do_settings_sections('c2t');
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
