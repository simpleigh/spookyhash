# Changelog

## 1.1.0

This release fixes #1 (Cannot build library on MacOS).
CI tests now run on MacOS as well as Ubuntu in order to prevent this recurring.

## 1.0.0

This release adds the `Hash` class which allows hashes to be assembled from
separate pieces rather than all in one go.
This represents the last piece of critical functionality from SpookyHashV2.

Other improvements:

* expanded documentation
* created this changelog
* enhanced testing

## 0.2.0

This release adds the `hash64` and `hash32` functions.
It also includes unit tests to validate that everything is working correctly.

## 0.1.0

Initial release, supporting `hash128` only.
