import { DeeplinkType } from './deeplink-type.enum';

export function longDynamicLinkGenerator(
  campId?: string,
  childId?: string,
  bookingId?: string,
  requestId?: string,
  type?: DeeplinkType,
): string {
  switch (type) {
    case DeeplinkType.CAMP_DETAIL:
      return `https://summercircles.page.link/?efr=0&ibi=com.borneagency.Summercircles&apn=com.borneagency.Summercircles&imv=1&amv=1&link=https%3A%2F%2Fwww.google.com%2FcampDetail%3FcampId%3D${campId}`;

    case DeeplinkType.BOOK_INVITATION:
      return `https://summercircles.page.link/?efr=0&ibi=com.borneagency.Summercircles&apn=com.borneagency.Summercircles&imv=1&amv=1&link=https%3A%2F%2Fwww.google.com%2FbookingInvitation%3FcampId%3D${bookingId}`;

    case DeeplinkType.ACCEPT_CIRCLE_INVITATION:
      return `https://summercircles.page.link/?efr=0&ibi=com.borneagency.Summercircles&apn=com.borneagency.Summercircles&imv=1&amv=1&link=https%3A%2F%2Fwww.google.com%2FacceptCircleInvitation%3FcampId%3D${campId}%3FchildId%3D${childId}`;

    case DeeplinkType.ACCEPT_FRIEND_REQUEST:
      return `https://summercircles.page.link/?efr=0&ibi=com.borneagency.Summercircles&apn=com.borneagency.Summercircles&imv=1&amv=1&link=https%3A%2F%2Fwww.google.com%2FacceptFriendRequest%3FrequestId%3D${requestId}`;

    case DeeplinkType.REJECT_FRIEND_REQUEST:
      return `https://summercircles.page.link/?efr=0&ibi=com.borneagency.Summercircles&apn=com.borneagency.Summercircles&imv=1&amv=1&link=https%3A%2F%2Fwww.google.com%2FrejectFriendRequest%3FrequestId%3D${requestId}`;

    default:
      throw new Error('Invalid DeeplinkType');
  }
}
