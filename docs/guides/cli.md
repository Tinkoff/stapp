# Stapp CLI

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [`init`](#init)
- [`ready`](#ready)
- [`disconnect`](#disconnect)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

`stapp-cli-tools` can be used to install and update stapp packages and theirs peer dependencies.
Also, we definitely plan to implement various code generation features. 

## Installation and usage
```text
npm install stapp-cli-tools -g
```

### `stapp-update`
```
$ stapp update --help

  Usage: stapp-update [options]
  
  Update existing stapp packages.
  
  Options:
    --no-peer         Skip peer dependencies installation.
    --no-save         Prevents saving to dependencies. Same as --no-save for npm-install.
    -E, --save-exact  Saved dependencies will be configured with an exact version. Same as --save-exact for npm-install.
    -n, --next        Use @next instead of @latest as a default tag.
    -h, --help        output usage information
  
  Examples:
  
    01. Automatically updates existing stapp packages and it's peer dependencies:
    $ stapp update
      ✔ Checking packages
      ✔ Fetching packages meta
      ✔ Collecting peer dependencies
      ✔ Checking existing packages
      ✔ Installing and updating dependencies
  
    Successfully installed and/or updated packages:
      ✔ stapp@2.6.0
      ✔ redux@4.0.1
  
    Installation of some packages was skipped, see details below.
      ℹ rxjs@6.4.0:  Package rxjs@6.4.0 already installed and is up to date
  
    02. Skipping peer dependencies with --no-peer:
    $ stapp update --no-peer
      ✔ Checking packages
      ✔ Fetching packages meta
      ✔ Collecting peer dependencies
      ✔ Checking existing packages
      ✔ Installing and updating dependencies
  
    Successfully installed and/or updated packages:
      ✔ stapp@2.6.0
  
    ⚠ Peer dependencies check was skipped.
  
    03. Using @next tag with --next:
    $ stapp update --next
      ✔ Parsing packages
      ✔ Fetching packages meta
      ✔ Collecting peer dependencies
      ✔ Checking existing packages
      ✔ Installing dependencies
  
    Successfully installed and/or updated packages:
      ✔ stapp@2.7.0-beta.3
      ✔ redux@4.0.1
  
    Installation of some packages was skipped, see details below.
      ℹ rxjs@6.4.0:  Package rxjs@6.4.0 already installed and is up to date
```

### `stapp-install`
```
$ stapp install --help

  Usage: stapp-install [options]
  
  Install one or more stapp packages and related dependencies.
  
  Automatically handles tags, versions and peerDependencies.
  
  Options:
    --no-peer         Skip peer dependencies installation.
    --no-save         Prevents saving to dependencies. Same as --no-save for npm-install.
    --no-reinstall    Do not reinstall existing packages if they satisfy corresponding ranges.
    -E, --save-exact  Saved dependencies will be configured with an exact version. Same as --save-exact for npm-install.
    -n, --next        Use @next instead of @latest as a default tag.
    -h, --help        output usage information
  
  Examples:
  
    01. Automatically installs latest versions of provided packages and it's peer dependencies:
    $ stapp install stapp stapp-validate
      ✔ Parsing packages
      ✔ Fetching packages meta
      ✔ Collecting peer dependencies
      ✔ Checking existing packages
      ✔ Installing dependencies
  
    Successfully installed and/or updated packages:
      ✔ stapp@2.6.0-3
      ✔ stapp-validate@2.6.0
      ✔ redux@4.0.1
      ✔ rxjs@6.4.0
      ✔ stapp-formbase@2.6.0
  
    02. Accepts shortnames:
    $ stapp install formbase
      ✔ Parsing packages
      ✔ Fetching packages meta
      ✔ Collecting peer dependencies
      ✔ Checking existing packages
      ✔ Installing dependencies
  
    Successfully installed and/or updated packages:
      ✔ stapp-formbase@2.6.0
      ✔ reselect@4.0.0
      ✔ stapp@2.6.0
  
    03. Fixes typos (if answer is not "y"/"yes", package installation will be skipped):
    $ stapp install stap
      ⠦ Parsing packages
        → ? "stap" does not exist. Did you mean stapp? (Y)
        Fetching packages meta
        Collecting peer dependencies
        Checking existing packages
        Installing dependencies
  
    04. Skipping peer dependencies with --no-peer:
    $ stapp install stapp --no-peer
      ✔ Parsing packages
      ✔ Fetching packages meta
      ✔ Collecting peer dependencies
      ✔ Checking existing packages
      ✔ Installing dependencies
  
    Successfully installed and/or updated packages:
      ✔ stapp@2.6.0
  
    ⚠ Peer dependencies check was skipped.
  
    05. Skipping already installed packages with --no-reinstall:
    $ stapp install stapp --no-reinstall
      ✔ Parsing packages
      ✔ Fetching packages meta
      ✔ Collecting peer dependencies
      ✔ Checking existing packages
      ✔ Installing dependencies
  
    ℹ Nothing was installed nor updated.
  
    Installation of some packages was skipped, see details below.
      ℹ stapp@2.6.0:  Package stapp@2.6.0 already installed and is up to date
      ℹ redux@4.0.1:  Package redux@4.0.1 already installed and is up to date
      ℹ rxjs@6.4.0:  Package rxjs@6.4.0 already installed and is up to date
  
    06. Providing package versions:
    $ stapp install stapp@2.4.2
      ✔ Parsing packages
      ✔ Fetching packages meta
      ✔ Collecting peer dependencies
      ✔ Checking existing packages
      ✔ Installing dependencies
  
    Successfully installed and/or updated packages:
      ✔ stapp@2.4.2
      ✔ redux@3.7.2
  
    07. Using @next tag as default with --next:
    $ stapp install stapp --next
      ✔ Parsing packages
      ✔ Fetching packages meta
      ✔ Collecting peer dependencies
      ✔ Checking existing packages
      ✔ Installing dependencies
  
    Successfully installed and/or updated packages:
      ✔ stapp@2.7.0-beta.3
      ✔ redux@4.0.1
      ✔ rxjs@6.4.0
```
