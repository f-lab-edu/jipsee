import type { DataSourceInfo } from "@/entities/dataSource/model/dataSourceInfo";

// 데이터명, 제공 기관, 갱신 주기, 원본 링크는 백엔드가 저장하지 않는 고정 값임. 법령은 2단계에서 hidden을 풀어 켬
export const dataSourceInfos: readonly DataSourceInfo[] = [
	{
		source: "RENT_DEAL",
		name: "연립다세대 전월세 실거래",
		provider: "국토교통부, 공공데이터포털",
		updateCycle: "매일",
		originalUrl: "https://www.data.go.kr/data/15126473/openapi.do",
		hidden: false,
	},
	{
		source: "SALE_DEAL",
		name: "연립다세대 매매 실거래",
		provider: "국토교통부, 공공데이터포털",
		updateCycle: "매일",
		originalUrl: "https://www.data.go.kr/data/15126467/openapi.do",
		hidden: false,
	},
	{
		source: "BUILDING_REGISTER",
		name: "건축물대장 표제부",
		provider: "국토교통부 건축HUB",
		updateCycle: "매월",
		originalUrl: "https://www.data.go.kr/data/15134735/openapi.do",
		hidden: false,
	},
	{
		source: "LAW",
		name: "법령",
		provider: "법제처",
		updateCycle: "개정 시",
		originalUrl: "https://www.law.go.kr",
		hidden: true,
	},
];
