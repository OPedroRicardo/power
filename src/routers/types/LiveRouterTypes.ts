export type connectStateType = {
  roomId: number;
};

export type eventNamesType = 'member' | 'chat' | 'gift' | 'roomUser' | 'like' | 'social' | 'emote' | 'envelope' | 'questionNew' | 'linkMicBattle' | 'linkMicArmies' | 'liveIntro' | 'subscribe';

export type MonitorExtraType = {
  anchor_id: number;
  from_idc: string;
  from_user_id: number;
  gift_id: number;
  gift_type: number;
  log_id: string;
  msg_id: number;
  repeat_count: number;
  repeat_end: number;
  room_id: number;
  send_gift_profit_core_start_ms: number;
  send_gift_send_message_success_ms: number;
  to_user_id: number;
};

export type UserDetailsType = {
  createTime: string;
  bioDescription: string;
  profilePictureUrls?: (string)[] | null;
};

export type FollowInfoType = {
  followingCount: number;
  followerCount: number;
  followStatus: number;
  pushStatus: number;
};

export type GiftType = {
  gift_id: number;
  repeat_count: number;
  repeat_end: number;
  gift_type: number;
};

export type ExtendedGiftInfoType = {};

export type eventHandlerParamType = {
  giftId: number;
  repeatCount: number;
  repeatEnd: boolean;
  groupId: string;
  monitorExtra: MonitorExtraType;
  userId: string;
  secUid: string;
  uniqueId: string;
  nickname: string;
  profilePictureUrl: string;
  rollowRole: number;
  userDetails: UserDetailsType;
  followInfo: FollowInfoType;
  isModerator: boolean;
  isNewGifter: boolean;
  isSubscriber: boolean;
  topGifterRank: null;
  msgId: string;
  createTime: string;
  displayType: string;
  label: string;
  gift: GiftType;
  describe: string;
  giftType: number;
  diamondCount: number;
  giftName: string;
  giftPictureUrl: string;
  timestamp: number;
  extendedGiftInfo: ExtendedGiftInfoType;
  receiverUserId: string;
  userBadges: (null)[] | null;
  comment: string;
};

export type eventHandlerType = (data: eventHandlerParamType) => void;

export type connectionType = {
  connect: () => Promise<connectStateType | Error>;
  on: (eventName: eventNamesType, eventHandler: Partial<eventHandlerType>) => void;
};
