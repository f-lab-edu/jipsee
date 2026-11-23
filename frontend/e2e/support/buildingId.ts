// 목업 건물 번호를 건물 id({시군구 코드}-{법정동명}-{지번})로 바꿈. 1, 2, 4, 5는 상세 목업, 6부터는 페이지 나눔 목업. 3은 거래가 없어 제거한 번호라 비어 있음
const DETAIL_IDS: Record<number, string> = {
	1: "11440-망원동-12-3",
	2: "11440-망원동-12-5",
	4: "11440-망원동-16-2",
	5: "11440-망원동-17-4",
};

export function buildingIdOf(number: number) {
	return DETAIL_IDS[number] ?? `11440-망원동-${24 + number}-1`;
}

/** 건물 상세 경로. 앱의 paths.building과 같이 id를 URL 인코딩함 */
export function buildingPath(number: number) {
	return `/buildings/${encodeURIComponent(buildingIdOf(number))}`;
}

/** 건물 기준 채팅 경로 */
export function chatBuildingPath(number: number) {
	return `/chat?buildingId=${encodeURIComponent(buildingIdOf(number))}`;
}
