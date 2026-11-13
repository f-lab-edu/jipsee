import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

export type ChatSendRequest = {
	chatId: Nullable<number>;
	buildingId: Nullable<number>;
	content: string;
};
