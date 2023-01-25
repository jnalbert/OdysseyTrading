export interface ActiveTradeType {
  sendUserUuid: string;
  sendUsername: string;
  receiveUserUuid: string;
  receiveUsername: string;
  sendPinUuid: string;
  receivePinUuid: string;
  sendPinSrc: string;
  receivePinSrc: string;
  senderConfirmed: boolean;
  receiverConfirmed: boolean;
  isCanceled: boolean;
}