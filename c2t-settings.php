<?php

/**
 * Click 2 Threads Plugin Settings Page
 *
 * Implements settings page using WordPress Settings API. It includes:
 * - Default Threads Username: Validates and stores a username.
 * - Default Style: Allows selection between 'light' and 'dark' themes.
 *
 * @package Click2Threads
 */

// Prevent direct access to the file
if (!defined('ABSPATH')) {
    exit;
}

// Register settings, sections, and fields
function c2t_register_settings()
{
    // Register settings
    register_setting('c2t_settings_group', 'c2t_default_linklabel', 'c2t_validate_linklabel');
    register_setting('c2t_settings_group', 'c2t_default_username', 'c2t_validate_username');
    register_setting('c2t_settings_group', 'c2t_default_style');

    // Add settings section
    add_settings_section(
        'c2t_settings_section',
        __('Click 2 Threads Default Settings', 'click2threads'),
        'c2t_settings_section_callback',
        'c2t'
    );

    // Add settings fields
    add_settings_field(
        'c2t_default_linklabel',
        __('Default Share Label', 'click2threads'),
        'c2t_default_linklabel_callback',
        'c2t',
        'c2t_settings_section'
    );
    
    add_settings_field(
        'c2t_default_username',
        __('Default Threads Username', 'click2threads'),
        'c2t_default_username_callback',
        'c2t',
        'c2t_settings_section'
    );

    add_settings_field(
        'c2t_default_style',
        __('Default Theme', 'click2threads'),
        'c2t_default_style_callback',
        'c2t',
        'c2t_settings_section'
    );
}
add_action('admin_init', 'c2t_register_settings');

// Settings section callback
function c2t_settings_section_callback()
{
    echo '<p>Set the default  settings for new Click 2 Threads blocks. Settings for each block can be changed in the Gutenberg sidepanel menu.</p>';
}

function c2t_default_linklabel_callback() {
    $linklabel = get_option('c2t_default_linklabel');
    echo '<input type="text" id="c2t_default_linklabel" name="c2t_default_linklabel" value="' . esc_attr($linklabel) . '"/>';
    echo '<p class="description">' . __('Enter the default caption for the share label', 'click2threads') . '</p>';
}

function c2t_default_username_callback() {
    $username = get_option('c2t_default_username');
    echo '<input type="text" id="c2t_default_username" name="c2t_default_username" value="' . esc_attr($username) . '"/>';
    echo '<p class="description">' . __('Enter the default Threads username for new blocks (without @).', 'click2threads') . '</p>';
}


function c2t_default_style_callback()
{
    $style = get_option('c2t_default_style');
    echo '<select id="c2t_default_style" name="c2t_default_style">
            <option value="light"' . selected($style, 'light', false) . '>Light</option>
            <option value="dark"' . selected($style, 'dark', false) . '>Dark</option>
          </select>';
    echo '<p class="description">' . __('Choose between Light and Dark theme.<br> For further CSS customization the main &lt;div&gt; of the block has the class "wp-block-eetezadi-click2threads".', 'click2threads') . '</p>';
}

function c2t_validate_linklabel($input)
{
    $input = trim($input);
    $maxchar = 80; // arbitrary what fits in

    // Check valid Instagram username if not empty
    if (empty($input) || strlen($input) > $maxchar ) {
        add_settings_error(
            'c2t_default_linklabel',
            'c2t_default_linklabel_error',
            __('Invalid Share Label: 1-80 characters', 'click2threads'),
            'error'
        );
        $input = substr($input, 0, $maxchar);
        //return get_option('c2t_default_linklabel');
    }
    return sanitize_text_field($input);
}

function c2t_validate_username($input)
{
    $input = trim($input);

    // Check valid Instagram username if not empty
    if (!empty($input) && !preg_match('/^(?![.])[a-zA-Z0-9._]{1,30}(?<!\.)$/', $input)) {
        add_settings_error(
            'c2t_default_username',
            'c2t_default_username_error',
            __('Invalid Threads Username: 1-30 characters, only letters, numbers, periods, and underscores', 'click2threads'),
            'error'
        );
        //return get_option('c2t_default_username');
    }
    return sanitize_text_field($input);
}

// Add the submenu page under the Settings menu
function c2t_add_options_page()
{
    add_submenu_page(
        'options-general.php',
        'Click 2 Threads',
        'Click 2 Threads',
        'manage_options',
        'c2t-settings',
        'c2t_options_page_html'
    );
}
add_action('admin_menu', 'c2t_add_options_page');

// Display the settings page content
function c2t_options_page_html()
{
    // Check user capabilities
    if (!current_user_can('manage_options')) {
        return;
    }

    // Admin page markup
?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('c2t_settings_group');
            do_settings_sections('c2t');
            submit_button('Save');
            ?>
        </form>
    </div>
    <div class="c2t-footer">
            <p>Developed by <strong>Sina Eetezadi</strong> blogging at <a href="https://fasterbikeblog.com" target="_blank">Faster Bike Blog</a>. The source code can be found on <a href="https://github.com/eetezadi/wordpress-click2threads" target="_blank">GitHub</a>.</p>
        </div>
    </div>
    <style>
        .c2t-footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-style: italic;
        }
    </style>
<?php
}
