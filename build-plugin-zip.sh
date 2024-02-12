#!/bin/bash

# Script for WordPress plugin block development. It compiles block assets using 'npm run build',
# attempts to read the plugin name from 'src/block.json'. If successful, it names the zip file after the plugin,
# appending a timestamp for uniqueness. If the plugin name cannot be read, it defaults to "plugin-<timestamp>.zip".
# Official WP scripts does not properly include PHP files so this was made

# Run npm build command
echo "Running npm build..."
npm run build

if [ $? -eq 0 ]; then
    echo "npm build successful. Proceeding to read plugin name..."

    # Attempt to extract the plugin name from block.json, fall back to default if unsuccessful
    PLUGIN_NAME=$(jq -r '.name | split("/")[1] // "plugin"' src/block.json)
    TIMESTAMP=$(date +%Y%m%d%H%M%S)

    # Attempt to extract the plugin name and version from block.json
    PLUGIN_PART=$(jq -r '.name | split("/")[1] // "plugin"' src/block.json)
    VERSION=$(jq -r '.version // "1.0.0"' src/block.json)

    if [ ! -z "$PLUGIN_PART" ] && [ ! -z "$VERSION" ]; then
        echo "Using name and version for zip file: $PLUGIN_PART-$VERSION"
    else
        echo "Defaulting to generic name and version for zip file."
        PLUGIN_PART="plugin"
        VERSION="1.0.0"
    fi

    ZIPFILE="${PLUGIN_PART}-${VERSION}.zip"
    zip -r "$ZIPFILE" *.php build/

    if [ $? -eq 0 ]; then
        echo "Successfully created zip file: $ZIPFILE"
    else
        echo "Failed to create zip file."
    fi
else
    echo "npm build failed. Aborting zip operation."
fi
