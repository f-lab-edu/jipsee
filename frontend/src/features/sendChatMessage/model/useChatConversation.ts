"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { streamChatAnswer } from "@/entities/chat/api/streamChatAnswer";
import type { ChatErrorCode } from "@/entities/chat/model/chatErrorCode";
import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import type { ChatConversationState } from "@/features/sendChatMessage/model/chatConversationState";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";

interface UseChatConversationOptions {
	chatId: Nullable<number>;
	buildingId: Nullable<number>;
	initialMessages: ChatMessage[];
	isLimitReached: boolean;
	firstQuestion: Nullable<string>;
}

/**
 * 채팅 > 대화 상태
 *
 * - 질문을 보내면 사용자 말풍선을 붙이고 waiting, 첫 글자가 오면 streaming, 끝나면 idle로 변경
 * - 첫 질문이 있으면 처음 그릴 때 바로 전송
 * - 새 대화의 스트림이 끝나면 /chat/{id}로 바꾸고, 지난 대화의 스트림이 끝나면 화면을 새로 고쳐 대화 목록 레일을 갱신
 * - CHAT_DAILY_LIMIT이면 방금 붙인 질문 말풍선을 지우고 limit으로 변경
 * - TOO_MANY_REQUESTS이면 받은 글자를 지우고 error로 변경
 * - SERVER_ERROR, 알 수 없는 오류 코드, 스트림 중간 끊김, 연결 실패이면 받은 글자를 지우고 error로 바꾸고 오류 코드는 SERVER_ERROR로 설정
 * - UNAUTHORIZED이면 돌아올 경로를 담아 로그인으로 이동
 * - 실패하거나 한도에 걸리면 이벤트로 받은 저장 전 대화 번호를 요청 전 값으로 되돌려, 새 대화의 다시 시도가 새 대화로 이동
 * - 취소하면 질문을 보내기 전 상태로 복원
 * - 새 요청을 시작하면 이전 요청을 취소하고, 현재 요청이 아닌 요청의 결과는 화면에 반영하지 않음
 * - 다시 시도는 실패한 질문 말풍선을 지우고 같은 질문을 새 요청으로 전송
 *
 * @param firstQuestion 처음 그릴 때 바로 보낼 질문
 */
export function useChatConversation({
	chatId,
	buildingId,
	initialMessages,
	isLimitReached,
	firstQuestion,
}: UseChatConversationOptions) {
	const router = useRouter();
	const [state, setState] = useState<ChatConversationState>({
		chatId,
		messages: initialMessages,
		draft: "",
		phase: isLimitReached ? "limit" : "idle",
		errorCode: null,
	});
	const stateRef = useRef(state);
	const abortRef = useRef<Nullable<AbortController>>(null);
	const localIdRef = useRef(0);

	const start = useCallback(
		async (baseMessages: ChatMessage[], question: string) => {
			abortRef.current?.abort();
			const controller = new AbortController();
			abortRef.current = controller;
			localIdRef.current -= 1;
			const userMessage: ChatMessage = {
				id: localIdRef.current,
				role: "USER",
				content: question,
				sources: [],
				buildings: [],
				createdAt: new Date().toISOString(),
			};
			const previousChatId = stateRef.current.chatId;
			const isNewChat = previousChatId === null;
			let createdChatId: Nullable<number> = null;
			let isDone = false;

			setState((previous) => ({
				...previous,
				messages: [...baseMessages, userMessage],
				draft: "",
				phase: "waiting",
				errorCode: null,
			}));

			const fail = (code: ChatErrorCode) =>
				setState((previous) => ({
					...previous,
					chatId: previousChatId,
					draft: "",
					phase: "error",
					errorCode: code,
				}));

			try {
				for await (const event of streamChatAnswer(
					{
						chatId: previousChatId,
						buildingId,
						content: question,
					},
					controller.signal,
				)) {
					if (abortRef.current !== controller) {
						return;
					}

					if (event.type === "chat") {
						createdChatId = event.chatId;
						setState((previous) => ({ ...previous, chatId: event.chatId }));
					}

					if (event.type === "delta") {
						setState((previous) => ({
							...previous,
							draft: previous.draft + event.text,
							phase: "streaming",
						}));
					}

					if (event.type === "done") {
						isDone = true;
						setState((previous) => ({
							...previous,
							messages: [...previous.messages, event.message],
							draft: "",
							phase: "idle",
						}));

						if (isNewChat && createdChatId !== null) {
							router.replace(paths.chatDetail(createdChatId), {
								scroll: false,
							});
						}

						if (!isNewChat) {
							router.refresh();
						}
					}

					if (event.type === "error") {
						if (event.code === "CHAT_DAILY_LIMIT") {
							setState((previous) => ({
								...previous,
								chatId: previousChatId,
								messages: baseMessages,
								draft: "",
								phase: "limit",
							}));
							return;
						}

						if (event.code === "UNAUTHORIZED") {
							router.push(
								paths.loginWithNext(
									`${window.location.pathname}${window.location.search}`,
								),
							);
							return;
						}

						if (event.code === "TOO_MANY_REQUESTS") {
							fail(event.code);
							return;
						}

						fail("SERVER_ERROR");
						return;
					}
				}

				if (abortRef.current === controller && !isDone) {
					fail("SERVER_ERROR");
				}
			} catch {
				if (abortRef.current !== controller) {
					return;
				}

				if (controller.signal.aborted) {
					setState((previous) => ({
						...previous,
						chatId: previousChatId,
						messages: baseMessages,
						draft: "",
						phase: "idle",
					}));
					return;
				}

				fail("SERVER_ERROR");
			}
		},
		[buildingId, router],
	);

	const startRef = useRef(start);

	const send = useCallback(
		(question: string) => {
			const { phase, messages } = stateRef.current;

			if (phase === "waiting" || phase === "streaming" || phase === "limit") {
				return;
			}

			start(messages, question);
		},
		[start],
	);

	const retry = useCallback(() => {
		const { phase, messages } = stateRef.current;
		const failedQuestion = messages.at(-1);

		if (phase !== "error" || failedQuestion?.role !== "USER") {
			return;
		}

		start(messages.slice(0, -1), failedQuestion.content);
	}, [start]);

	useEffect(() => {
		stateRef.current = state;
		startRef.current = start;
	});

	useEffect(() => {
		if (firstQuestion !== null) {
			startRef.current(stateRef.current.messages, firstQuestion);
		}

		return () => abortRef.current?.abort();
	}, [firstQuestion]);

	return { ...state, send, retry };
}
