import { Types } from 'ably';

import Space, { SpaceMember } from './Space.js';
import EventEmitter from './utilities/EventEmitter.js';
import LocationTracker, { LocationTrackerPredicate } from './LocationTracker.js';
import { LOCATION_UPDATE } from './utilities/Constants.js';

type LocationUpdate = typeof LOCATION_UPDATE;

type LocationEventMap = Record<LocationUpdate, any>;

export type LocationChange<T> = {
  member: SpaceMember;
  previousLocation: any;
  currentLocation: T;
};

export default class Locations extends EventEmitter<LocationEventMap> {
  constructor(public space: Space, private channel: Types.RealtimeChannelPromise) {
    super();
    this.channel.presence.subscribe(this.onPresenceUpdate.bind(this));
  }

  private onPresenceUpdate(message: Types.PresenceMessage) {
    if (!['update', 'leave'].includes(message.action)) return;

    const { location } = message.data;
    const member = this.space.getMemberFromConnection(message.connectionId);

    if (member) {
      const previousLocation = member.location;
      member.location = location;
      this.emit(LOCATION_UPDATE, { member, currentLocation: location, previousLocation });
    }
  }

  set(location) {
    const self = this.space.getSelf();
    if (!self) {
      throw new Error('Must enter a space before setting a location');
    }
    return this.channel.presence.update({
      profileData: self.profileData,
      location,
    });
  }

  createTracker<T>(locationTrackerPredicate: LocationTrackerPredicate<T>) {
    return new LocationTracker<T>(this, locationTrackerPredicate);
  }
}
