import { describe, expect, it } from "vitest";
import { dataSourcesCopy } from "@/pages/policy/config/dataSourcesCopy";

describe("dataSourcesCopy", () => {
	it("한계 안내 줄이 본문 문서 3.1절의 첫 두 줄과 같음", () => {
		expect(dataSourcesCopy.noticeLines).toEqual([
			"확정일자를 기준으로 수집한 거래예요. 최근 1~2개월 거래는 일부 빠져 있을 수 있어요",
			"거래가 공개되기까지 시간이 걸려 늦게 나타나는 거래도 있어요",
		]);
	});

	it("공시가격 안내는 부동산공시가격 알리미 링크로 이어짐", () => {
		const { prefix, linkLabel, suffix, href } = dataSourcesCopy.priceNotice;

		expect(`${prefix}${linkLabel}${suffix}`).toBe(
			"공시가격은 직접 보여 주지 않아요. 부동산공시가격 알리미에서 확인해 주세요",
		);
		expect(href).toBe("https://www.realtyprice.kr");
	});

	it("임시 초안 안내 문구가 정해진 문장임", () => {
		expect(dataSourcesCopy.draftNotice).toBe(
			"임시로 적은 안내예요. 정식 안내가 나오면 내용이 바뀔 수 있어요",
		);
	});
});
