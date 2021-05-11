import semver from "semver";
import type { KitConfig } from "./kitConfig";

export type KitCapabilities = Required<
  Pick<
    KitConfig,
    "capabilities" | "kitType" | "reactNativeVersion" | "reactNativeDevVersion"
  >
>;

export function getKitCapabilities({
  capabilities = [],
  kitType = "library",
  reactNativeVersion,
  reactNativeDevVersion: rawDevVersion,
}: KitConfig): KitCapabilities {
  if (
    !reactNativeVersion ||
    (!semver.valid(reactNativeVersion) &&
      !semver.validRange(reactNativeVersion))
  ) {
    throw new Error(`'${reactNativeVersion}' is not a valid version range`);
  }

  const reactNativeDevVersion =
    rawDevVersion || semver.minVersion(reactNativeVersion)?.version;

  if (
    !reactNativeDevVersion ||
    !semver.satisfies(reactNativeDevVersion, reactNativeVersion)
  ) {
    throw new Error(
      `'${reactNativeDevVersion}' is not a valid dev version because it does not satisfy supported version range '${reactNativeVersion}'`
    );
  }

  return {
    capabilities,
    kitType,
    reactNativeVersion,
    reactNativeDevVersion,
  };
}