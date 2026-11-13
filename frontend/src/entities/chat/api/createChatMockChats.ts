import {
	chatMockAnswers,
	chatMockBuildings,
} from "@/entities/chat/api/chatMock";
import { createKstDate } from "@/entities/chat/lib/createKstDate";
import { toKstIso } from "@/entities/chat/lib/toKstIso";
import { toKstParts } from "@/entities/chat/lib/toKstParts";
import type { Chat } from "@/entities/chat/model/chat";

const dayMs = 24 * 60 * 60 * 1000;

/**
 * 채팅 > 목업 대화 생성
 *
 * - 마지막 메시지 시각이 오늘 14:20, 어제, 올해 10월 21일, 18일, 15일인 대화 다섯 개를 최근 순으로 반환
 * - 시각을 지금을 기준으로 만들어 목록 표시 문구가 날짜가 바뀌어도 같음
 * - 4번 대화는 건물 1번 기준임
 */
export function createChatMockChats(now: Date): Chat[] {
	const today = toKstParts(now);
	const yesterday = toKstParts(new Date(now.getTime() - dayMs));
	const times = [
		toKstIso(createKstDate(today.year, today.month, today.day, 14, 20)),
		toKstIso(
			createKstDate(yesterday.year, yesterday.month, yesterday.day, 12, 0),
		),
		toKstIso(createKstDate(today.year, 10, 21, 10, 0)),
		toKstIso(createKstDate(today.year, 10, 18, 10, 0)),
		toKstIso(createKstDate(today.year, 10, 15, 10, 0)),
	];
	const building = chatMockBuildings[0];

	return [
		{
			id: 1,
			title: "○○빌라 주변 전세 거래 알려줘",
			lastMessageAt: times[0],
			buildingId: null,
			buildingName: null,
			messages: [
				{
					id: 1,
					role: "USER",
					content: "○○빌라 주변 전세 거래 알려줘",
					sources: [],
					buildings: [],
					createdAt: times[0],
				},
				{
					id: 2,
					role: "ASSISTANT",
					content: chatMockAnswers.deals.lines.join("\n"),
					sources: chatMockAnswers.deals.sources,
					buildings: chatMockAnswers.deals.buildings,
					createdAt: times[0],
				},
				{
					id: 3,
					role: "USER",
					content: "계약갱신요구권은 언제 쓰나요?",
					sources: [],
					buildings: [],
					createdAt: times[0],
				},
				{
					id: 4,
					role: "ASSISTANT",
					content: chatMockAnswers.renewal.lines.join("\n"),
					sources: chatMockAnswers.renewal.sources,
					buildings: chatMockAnswers.renewal.buildings,
					createdAt: times[0],
				},
			],
		},
		{
			id: 2,
			title: "계약갱신요구권은 언제 쓰나요?",
			lastMessageAt: times[1],
			buildingId: null,
			buildingName: null,
			messages: [
				{
					id: 1,
					role: "USER",
					content: "계약갱신요구권은 언제 쓰나요?",
					sources: [],
					buildings: [],
					createdAt: times[1],
				},
				{
					id: 2,
					role: "ASSISTANT",
					content: chatMockAnswers.renewal.lines.join("\n"),
					sources: chatMockAnswers.renewal.sources,
					buildings: chatMockAnswers.renewal.buildings,
					createdAt: times[1],
				},
			],
		},
		{
			id: 3,
			title: "전입신고는 언제 해야 해?",
			lastMessageAt: times[2],
			buildingId: null,
			buildingName: null,
			messages: [
				{
					id: 1,
					role: "USER",
					content: "전입신고는 언제 해야 해?",
					sources: [],
					buildings: [],
					createdAt: times[2],
				},
				{
					id: 2,
					role: "ASSISTANT",
					content: chatMockAnswers.placeholder.lines.join("\n"),
					sources: chatMockAnswers.placeholder.sources,
					buildings: chatMockAnswers.placeholder.buildings,
					createdAt: times[2],
				},
			],
		},
		{
			id: 4,
			title: "이 건물 최근 2년 전세 거래 알려줘",
			lastMessageAt: times[3],
			buildingId: building.id,
			buildingName: building.name,
			messages: [
				{
					id: 1,
					role: "USER",
					content: "이 건물 최근 2년 전세 거래 알려줘",
					sources: [],
					buildings: [],
					createdAt: times[3],
				},
				{
					id: 2,
					role: "ASSISTANT",
					content: chatMockAnswers.placeholder.lines.join("\n"),
					sources: chatMockAnswers.placeholder.sources,
					buildings: chatMockAnswers.placeholder.buildings,
					createdAt: times[3],
				},
			],
		},
		{
			id: 5,
			title: "보증금을 얼마까지 올릴 수 있어?",
			lastMessageAt: times[4],
			buildingId: null,
			buildingName: null,
			messages: [
				{
					id: 1,
					role: "USER",
					content: "보증금을 얼마까지 올릴 수 있어?",
					sources: [],
					buildings: [],
					createdAt: times[4],
				},
				{
					id: 2,
					role: "ASSISTANT",
					content: chatMockAnswers.placeholder.lines.join("\n"),
					sources: chatMockAnswers.placeholder.sources,
					buildings: chatMockAnswers.placeholder.buildings,
					createdAt: times[4],
				},
			],
		},
	];
}
