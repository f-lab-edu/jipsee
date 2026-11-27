// 목업 검색은 건물명과 주소에 검색어의 모든 단어가 들어간 건물을 돌려줌. 실제 백엔드로 돌릴 때는 이 값들을 시드 데이터에 맞춰 바꿈
// KEYWORD는 한 페이지(20건)를 넘는 결과, OTHER_KEYWORD는 KEYWORD와 다른 결과, NO_RESULT_KEYWORD는 결과가 없는 검색어임
export const KEYWORD = "망원동";
export const OTHER_KEYWORD = "망원빌라";
export const NO_RESULT_KEYWORD = "존재하지않는동네";
export const SEARCH_PATH = `/search?keyword=${encodeURIComponent(KEYWORD)}`;

export const SITE_NAME = "집씨";
export const SITE_DESCRIPTION =
	"연립, 다세대 전월세 실거래를 공공데이터 그대로 보여줘요";
export const SEARCH_TITLE = "망원동 검색 결과 | 집씨";
// 홈과 검색 결과 화면의 h1
export const HOME_TITLE = "연립, 다세대 주택의 전월세 실거래가";

// 목업 검색 결과의 규모와 건물. 목업은 KEYWORD에 47건(번호 1, 2, 4~48)을 20건씩 나누어 줌
export const PAGE_SIZE = 20;
export const TOTAL = 47;
// 건물명이 없어 지번이 제목임
export const NO_NAME = { id: 4, lot: "마포구 망원동 16-2" };
// 건물명이 없어 지번이 제목임. 둘째 페이지에 있음
export const BARE = { id: 35, lot: "마포구 망원동 59-1" };
