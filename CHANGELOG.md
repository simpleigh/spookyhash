# Changelog

## 3.0.0

This release updates the supported versions of Node.

Breaking changes:

* Node 12 is no longer supported
* Node 14 is no longer supported

## 2.0.0

This release updates the supported versions of Node.

Breaking changes:

* Node 10 is no longer supported
* Node 15 is no longer supported

## 1.2.1

This patch release bumps dependency versions in order to fix a security issue.

## 1.2.0

This release fixes #2 (Cannot build library on Node 10.20) by dropping support
for `BigInt` values on early versions of Node.js. This pushes support back to
version 10.16 (earlier versions compile but the testsuite fails).

As `BigInt` values may not be available we now allow seed parameters to be
passed as 8-byte `Buffer` values instead.

Other improvements:

* sundry code tidying (particularly DRYing up parameter validation)

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
