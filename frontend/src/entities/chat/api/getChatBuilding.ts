import { chatMockBuildings } from "@/entities/chat/api/chatMock";
import type { ChatBuildingLink } from "@/entities/chat/model/chatBuildingLink";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

/**
 * 채팅 > 건물 조회
 *
 * - 이름이 있으면 이름, 없으면 주소를 name에 담아 반환
 * - 없는 건물이면 null 반환
 * - 백엔드가 없어 목업이 조회를 대신함
 */
export async function getChatBuilding(
	id: number,
): Promise<Nullable<ChatBuildingLink>> {
	return chatMockBuildings.find((building) => building.id === id) ?? null;
}
