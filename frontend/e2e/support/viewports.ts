export const MOBILE = { width: 390, height: 844 };
export const DESKTOP = { width: 1440, height: 900 };
// 480px 이하 모바일 흰 세로 열(화면 폭 전체). 2026-11-13 흰 세로 열 변경으로 본문 카드(gutter 16 + border 1)가 없어짐
export const MOBILE_COLUMN = { x: 0, width: 390 };
// 모바일 본문 카드 첫 줄 건물명 제목 블록 높이(위 padding 20 + 줄 24). 2026-11-09 피드백 7번
export const MOBILE_TITLE_HEIGHT = 44;
// 하단 내비게이션 높이(위 테두리 1 + 탭 56). 안전 영역은 브라우저에서 0임. 2026-11-12 하단 내비게이션 설계 3.2절
export const BOTTOM_NAV_HEIGHT = 57;
// 모바일 푸터 높이. 하단 내비게이션 바로 위에 고정됨. 2026-11-13 흰 세로 열 설계 10.2절
export const FOOTER_MOBILE_HEIGHT = 44;
