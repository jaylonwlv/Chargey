// Adds the native "Play Chargey Sound" Shortcuts action (plugins/ios/ChargeyIntent.swift)
// to the iOS app target. Runs during `expo prebuild`, which EAS Build does for you.
const fs = require('fs');
const path = require('path');
const { IOSConfig } = require('expo/config-plugins');

const SWIFT_FILE = 'ChargeyIntent.swift';

module.exports = function withChargeyIntent(config) {
  const contents = fs.readFileSync(path.join(__dirname, 'ios', SWIFT_FILE), 'utf8');
  return IOSConfig.XcodeProjectFile.withBuildSourceFile(config, {
    filePath: SWIFT_FILE,
    contents,
    overwrite: true,
  });
};
