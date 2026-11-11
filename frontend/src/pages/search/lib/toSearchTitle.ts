import { searchTitleCopy } from "@/pages/search/config/searchTitleCopy";

/** 검색 > 제목 변환 */
export function toSearchTitle(keyword: string): string {
	return `${keyword} ${searchTitleCopy.suffix}`;
}
