import type { ChatBuildingLink } from "@/entities/chat/model/chatBuildingLink";
import type { ChatMockAnswer } from "@/entities/chat/model/chatMockAnswer";
import type { ChatMockScenario } from "@/entities/chat/model/chatMockScenario";

// 이 값을 고쳐 화면 상태를 바꿈. 질문 전송, 한도, 목록 비움을 이 값이 정함
export const chatMockScenario: ChatMockScenario = "normal";

// 답변 글자 조각 사이 지연. 첫 조각이 오기 전 점 세 개 단계도 이 간격만큼 보임
export const chatMockStreamDelayMs = 400;

// 건물 상세 목업(id 1부터 5)과 같은 id. 1번은 시안에서 쓰는 이름임
export const chatMockBuildings: ChatBuildingLink[] = [
	{ id: 1, name: "○○빌라" },
	{ id: 2, name: "망원빌라 2차" },
	{ id: 3, name: "망원하우스" },
	{ id: 4, name: "마포구 망원동 16-2" },
	{ id: 5, name: "망원맨션" },
];

export const chatMockAnswers = {
	deals: {
		lines: [
			"반경 500m, 최근 12개월 기준",
			"신규 전세 14건입니다.",
			"○○빌라 2억 4,000만원 (2026.07) 외 13건",
		],
		sources: [
			{ label: "출처: 국토교통부 실거래가", baseLabel: "2026년 9월 기준" },
		],
		buildings: [{ id: 1, name: "○○빌라" }],
	},
	renewal: {
		lines: ["계약 만료 6개월 전부터 2개월 전까지 행사할 수 있습니다."],
		sources: [
			{
				label: "주택임대차보호법 제6조의3",
				baseLabel: "법제처, 2026년 9월 기준",
			},
		],
		buildings: [],
	},
	refuseJudgment: {
		lines: [
			"계약 여부는 판단하지 않습니다.",
			"건물 정보, 거래 기록은 안내합니다.",
		],
		sources: [],
		buildings: [],
	},
	refuseCase: {
		lines: ["개별 사건은 판단하지 않습니다.", "전문가 상담이 필요합니다."],
		sources: [
			{ label: "관련 조문: 주택임대차보호법 제3조의2", baseLabel: null },
		],
		buildings: [],
	},
	// 개발용 자리 문장이며 제품 문구가 아님
	placeholder: {
		lines: ["개발용 목업 답변입니다."],
		sources: [],
		buildings: [],
	},
} satisfies Record<string, ChatMockAnswer>;
