export enum EAgoraRoles {
  SUBSCRIBER = 'SUBSCRIBER',
  PUBLISHER = 'PUBLISHER',
}

export type AgoraRoles = keyof typeof EAgoraRoles;