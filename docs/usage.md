# Usage

## Prerequisites

### Ably API key

To use Spaces, you will need the following:

- An Ably account. You can [sign up](https://ably.com/signup) for free.
- An Ably API key. You can create API keys in an app within your [Ably account](https://ably.com/dashboard).
  - The API key needs the following [capabilities](https://ably.com/docs/realtime/authentication#capabilities-explained): `publish`, `subscribe`, `presence` and `history`.

### Environment

Spaces is built on top of the [Ably JavaScript SDK](https://github.com/ably/ably-js). Although the SDK supports Node.js and other JavaScript environments, at the time of writing our main target is an ES6 compatible browser environment.

## Installation

### NPM

```sh
npm install @ably-labs/spaces
```

If you need the Ably client (see [Authentication & instantiation](#authentication-and-instantiation))

```sh
npm install ably
```

### CDN

You can also use Spaces with a CDN like [unpkg](https://www.unpkg.com/):

```html
<script src="https://cdn.ably.com/lib/ably.min-1.js"></script>
<script src="https://unpkg.com/@ably-labs/spaces@0.0.10/dist/iife/index.bundle.js"></script>
```

Note that when you use a CDN, you need to include Ably Client as well, the Spaces bundle does not include it.

## Authentication and instantiation

Spaces use an [Ably promise-based realtime client](https://github.com/ably/ably-js#using-the-async-api-style). You can either pass an existing client to Spaces or pass the [client options](https://ably.com/docs/api/realtime-sdk?lang=javascript#client-options) directly to the spaces constructor.

To instantiate with options, you will need at minimum an [Ably API key](#ably-api-key) and a [clientId](https://ably.com/docs/auth/identified-clients?lang=javascripts). A clientId represents an identity of an connection. In most cases this will something like the id of a user:

_**Deprecated: the ClientOptions option will be removed in the next release. Use the Ably client instance method described underneath.**_

```ts
import Spaces from '@ably-labs/spaces';

const spaces = new Spaces({ key: "<API-key>", clientId: "<client-ID>" });
```

If you already have an ably client in your application, you can just pass it directly to Spaces (the client will still need to instantiated with a clientId):

```ts
import { Realtime } from 'ably/promise';
import Spaces from '@ably-labs/spaces';

const client = new Realtime.Promise({ key: "<API-key>", clientId: "<client-ID>" });
const spaces = new Spaces(client);
```

In both scenarios, you can access the client via `spaces.ably`.

To learn more about authenticating with ably, see our [authentication documentation](https://ably.com/docs/auth).

## Create a space

A space is the virtual area of an application you want to collaborate in, such as a web page, or slideshow. A `space` is uniquely identified by its name. A space is created, or an existing space retrieved from the `spaces` collection by calling the `get()` method. You can only connect to one space in a single operation. The following is an example of creating a space called "demonSlideshow":

```ts
const space = await spaces.get('demoSlideshow');
```

### Options

A set of `spaceOptions` can be passed to space when creating or retrieving it. See the [class definitions](/docs/class-definitions.md#spaceoptions) for details on what options are available.

The following is an example of setting `offlineTimeout` to 3 minutes and a `paginationLimit` of 10:

```ts
const space = await spaces.get('demoSlideshow', { offlineTimeout: 180_000, cursors: { paginationLimit: 10 } });
```

## Members

Members is a core concept of the library. When you enter a space, you become a `member`. On the client, your own membership is to referred to as `self`. You can get your `self` by calling `space.getSelf`. To get all the members (including self), call `space.getMembers`. These method will return (respectively an object and array of):

```js
{
  "clientId": "clemons#142",
  "connectionId": "hd9743gjDc",
  "isConnected": true,
  "lastEvent": {
    "name": "enter",
    "timestamp": 1677595689759
  },
  "location": null,
  "profileData": {
    "username": "Claire Lemons",
    "avatar": "https://slides-internal.com/users/clemons.png"
  }
}
```

See [SpaceMember](/docs/class-definitions.md#spacemember) for details on properties.

### Listen to members updates

The `space` instance is an `EventEmitter`. Events will be emitted for updates to members (including self). You can listen to the following events:

#### enter

Emitted when a member enters a space. Called with the member entering the space.

#### leave

Emitted when a member leaves a space. Called with the member leaving the space.

#### membersUpdate

Emitted when members enter, leave and their location is updated. Called with an array of all the members in the space.

```ts
space.subscribe('membersUpdate', (members) => {
  console.log(members);
});
```

To stop listening to member events, users can call the `space.unsubscribe()` method. See [Event emitters](#event-emitters) for options and usage.

### Enter a space

To become a member of a space (and use the other APIs, like location or cursors) a client needs to enter a space.

```ts
space.enter();
```

This method can take an optional object called `profileData` so that users can include convenient metadata to update an avatar stack, such as a username and profile picture.

```ts
space.enter({
  username: 'Claire Lemons',
  avatar: 'https://slides-internal.com/users/clemons.png',
});
```

### Leave a space

A leave event is sent when a user leaves a space. This can occur for one of the following reasons:

- `space.leave()` is called explicitly.
- The user closes the tab.
- The user is abruptly disconnected from the internet for longer than 2 minutes

A leave event does not remove the member immediately from members. Instead, they are removed after a timeout which is configurable by the [`offlineTimeout` option](#options). This allows the UI to display an intermediate state before disconnection/reconnection.

As with `enter`, you can update the `profileData` on leave:

```ts
space.leave({
  username: 'Claire Lemons',
  avatar: 'https://slides-internal.com/users/inactive.png',
});
```

### Update profileData

To update `profileData` provided when entering the space, use the `updateProfileData` method. Pass new `profileData` or a function to base the new `profileData` of the existing value:

```ts
await space.updateProfileData((oldProfileData) => {
  return {
    ...oldProfileData,
    username: 'Clara Lemons'
  }
});
```

## Location

Each member can set a location for themselves:

```ts
space.locations.set({ slide: '3', component: 'slide-title' });
```

A location does not have a prescribed shape. In your UI it can represent a single location (an id of a field in form), multiple locations (id's of multiple cells in a spreadsheet) or a hierarchy (a field in one of the multiple forms visible on screen).

The location property will be set on the [member](#members).

Because locations are part of members, a `memberUpdate` event will be emitted when a member updates their location. When a member leaves, their location is set to `null`.

```ts
space.subscribe('membersUpdate', (members) => {
  console.log(members);
});
```

However, it's possible to listen to just location updates. `locations` is an [event emitter](#event-emitters) and will emit the `locationUpdate` event:

```ts
space.locations.subscribe('locationUpdate', (locationUpdate) => {
  console.log(locationUpdate);
});
```

This event will include the member affected by the change, as well as their previous and current locations:

```json
{
  "member": {
    "clientId": "clemons#142",
    "connectionId": "hd9743gjDc",
    "isConnected": true,
    "profileData": {
      "username": "Claire Lemons",
      "avatar": "https://slides-internal.com/users/clemons.png"
    },
    "location": {
      "slide": "3",
      "component": "slide-title"
    },
    "lastEvent": {
      "name": "update",
      "timestamp": 1
    }
  },
  "previousLocation": {
    "slide": "2",
    "component": null
  },
  "currentLocation": {
    "slide": "3",
    "component": "slide-title"
  }
}
```

## Live Cursors

A common feature of collaborative apps is to show where a users cursors is positioned in realtime. It's easy to accomplish this with the `cursors` API.

The most common use case is to show the current mouse pointer position.

To start listing to cursor events, use the `.subscribe` method:

```ts
space.cursors.subscribe('cursorsUpdate', (cursorUpdate) => {
  console.log(cursorUpdate);
});
```

The listener will be called with a `CursorUpdate`:

```json
{
  "connectionId": "hd9743gjDc",
  "clientId": "clemons#142",
  "position": { "x": 864, "y": 32 },
  "data": { "color": "red" }
}
```

To set the position of a cursor and emit a `CursorUpdate`, first enter the space:

```ts
space.enter();
```

Then call `.set`:

```ts
window.addEventListener('mousemove', ({ clientX, clientY }) => {
  space.cursors.set({ position: { x: clientX, y: clientY } });
});
```

A `CursorUpdate` is an object with 2 properties. `position` is an object with 2 required properties, `x` and `y`. These represent the position of the cursor on a 2D plane. A second optional property, `data` can also be passed. This is an object of any shape and is meant for data associated with the cursor movement (like drag or hover calculation results):

```ts
window.addEventListener('mousemove', ({ clientX, clientY }) => {
  space.cursors.set({ position: { x: clientX, y: clientY }, data: { color: 'red' } });
});
```

### Initial cursor position and data

To retrieve the initial position and data of all cursors within a space, you can use the `space.cursors.getAll()` method. This returns an object keyed by `connectionId`. The value is the last `cursorUpdate` set by the given `connectionId`.

Example of calling `getAll()` to return all cursor positions:

```ts
const lastPositions = await space.cursors.getAll();
```

```ts
{
  "hd9743gjDc": {
    "connectionId": "hd9743gjDc",
    "clientId": "clemons#142",
    "position": {
      "x": 864,
      "y": 32
    },
    "data": {
      "color": "red"
    }
  }
}
```

## Event Emitters

`space`, `cursors` & `locations` are event emitters. Event emitters provide `subscribe` and `unsubscribe` methods to attach/detach event listeners. Both methods support overloaded versions, described below.


Calling `subscribe` with a single function argument will subscribe to all events on that emitter.

```ts
space.subscribe(() => {});
```

Calling `subscribe` with a named event and a function argument will subscribe to that event only.

```ts
space.subscribe(`membersUpdate`, () => {});
```

Calling `subscribe` with an array of named events and a function argument will subscribe to those events.

```ts
space.subscribe([`membersUpdate`], () => {});
```

Calling `unsubscribe` with no arguments will remove all registered listeners.

```ts
space.unsubscribe();
```

Calling `unsubscribe` with a single named event will remove all listeners registered for that event.

```ts
space.unsubscribe(`membersUpdate`);
```

Calling `unsubscribe` with an array of named events will remove all listeners registered for those events.

```ts
space.unsubscribe([`membersUpdate`]);
```

Calling `unsubscribe` and adding a listener function as the second argument to both of the above will remove only that listener.

```ts
const listener = () => {};
space.unsubscribe(`membersUpdate`, listener);
space.unsubscribe([`membersUpdate`], listener);
```

As with the native DOM API, this only works if the listener is the same reference as the one passed to `subscribe`.
