# Changelog

All notable changes to `icecast-status` will be documented in this file.

## 0.4.1 - 2020-06-12
## Fixed
- The settings would all go to null/NaN when just clicking save sometimes
- undefined value in proxy file

## 0.4.0 - 2020-06-12
## Changed
- Made the proxy call and default axios call split and use the same response handlers

## Fixed 
- Load the clock timer on initial load if there was a stream on already

## 0.3.2 - 2020-06-12
## Added
- Add a proxy call using functions to get past http issues of icecast servers from https

## 0.1.0 - initial releases

First release of the monitor. Has the base ideas working
