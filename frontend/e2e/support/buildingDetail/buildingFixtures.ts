// 설계 4.3절 목업 건물명. id 4는 이름이 없어 주소(마포구 망원동 16-2)가 제목임
export const NAMES: Record<number, string> = {
	1: "망원빌라",
	2: "망원빌라 2차",
	3: "망원하우스",
	5: "망원맨션",
};
export const ADDRESS_4 = /마포구 망원동 16-2$/;
export const OK_IDS = [1, 2, 3, 4, 5];
export const NOT_FOUND = ["999", "abc", "01", "0", "-1", "1.5", "1e3"];
