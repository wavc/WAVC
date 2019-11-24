
export class MessageModel {
    conversationId: number;
    content: string;
    senderId: string;
    type: MessageType;
    timestamp: any;
    constructor() {}
}

export enum MessageType {
    Text,
    Photo,
    File,
    Gif
}
