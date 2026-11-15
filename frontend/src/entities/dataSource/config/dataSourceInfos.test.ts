import { describe, expect, it } from "vitest";
import { dataSourceInfos } from "@/entities/dataSource/config/dataSourceInfos";

describe("dataSourceInfos", () => {
	it("보이는 출처는 전월세, 매매, 표제부 순서로 세 곳임", () => {
		const visible = dataSourceInfos.filter((info) => !info.hidden);

		expect(visible.map((info) => info.name)).toEqual([
			"연립다세대 전월세 실거래",
			"연립다세대 매매 실거래",
			"건축물대장 표제부",
		]);
	});

	it("보이는 출처의 제공 기관, 갱신 주기, 원본 링크가 본문 문서 표와 같음", () => {
		const visible = dataSourceInfos.filter((info) => !info.hidden);

		expect(
			visible.map(({ provider, updateCycle, originalUrl }) => ({
				provider,
				updateCycle,
				originalUrl,
			})),
		).toEqual([
			{
				provider: "국토교통부, 공공데이터포털",
				updateCycle: "매일",
				originalUrl: "https://www.data.go.kr/data/15126473/openapi.do",
			},
			{
				provider: "국토교통부, 공공데이터포털",
				updateCycle: "매일",
				originalUrl: "https://www.data.go.kr/data/15126467/openapi.do",
			},
			{
				provider: "국토교통부 건축HUB",
				updateCycle: "매월",
				originalUrl: "https://www.data.go.kr/data/15134735/openapi.do",
			},
		]);
	});

	it("법령 출처는 1단계에서 숨겨져 있음", () => {
		expect(dataSourceInfos.find((info) => info.source === "LAW")?.hidden).toBe(
			true,
		);
	});
});
