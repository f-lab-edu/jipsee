import { loadMoreCopy } from "@/features/loadMoreBuildings/config/loadMoreCopy";

/**
 * 더 보기 > 스크린 리더 알림 문구
 *
 * - 새로 붙은 건수에 맞춰 "N건을 더 불러왔어요" 반환
 */
export function toLoadMoreAnnouncement(count: number): string {
	return `${count}${loadMoreCopy.loadedSuffix}`;
}
