<?php

/**
 * Click 2 Share Plugin Api Endpoints
 *
 * Custom API endpoints to transfer data from Wordpress PHP to React JS
 * - Shortlink from wp_get_shortlink() as custom field in Post API
 *
 * @package Click2Share
 */

// Prevent direct access to the file
if (!defined('ABSPATH')) {
    exit;
}

// Register custom shortlink and parmalink field for the post API.
add_action( 'rest_api_init', function () {
    
    register_rest_field( 'post', 'c2sh_shortlink', array(
        'get_callback' => 'c2sh_get_post_shortlink',
        'update_callback' => null,
        'schema' => array(
            'description' => 'Shortlink of the post',
            'type' => 'string',
            'context' => array( 'view', 'edit' ),
        ),
    ) );
    
    register_rest_field( 'post', 'c2sh_permalink', array(
        'get_callback' => 'c2sh_get_post_permalink',
        'update_callback' => null,
        'schema' => array(
            'description' => 'Shortlink of the post',
            'type' => 'string',
            'context' => array( 'view', 'edit' ),
        ),
    ) );
} );

// Return Shortlink
function c2sh_get_post_shortlink( $object, $field_name, $request ) {
    $post_id = $object['id'];
    return wp_get_shortlink( $post_id );
}

// Return Permalink
function c2sh_get_post_permalink( $object, $field_name, $request ) {
    $post_id = $object['id'];
    return get_permalink( $post_id );
}
