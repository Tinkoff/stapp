# Application lifecycle

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [RxJS](#rxjs)
    - [Notice on interoperability with RxJS 6](#notice-on-interoperability-with-rxjs-6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

Stapp applications have two major events in their lifecycle.

## `init`
The initiation process starts when `createApp` is called. The completion of the process is indicated by the `initEvent`.

## `disconnect`
The disconnection process starts when `Stapp.disconnect` is called. It starts with the `disconnectEvent`.
After that the application disables all dispatch functions and unsubscribes from epics.
Note, that currently the application can't be restarted after the disconnection process completes.
