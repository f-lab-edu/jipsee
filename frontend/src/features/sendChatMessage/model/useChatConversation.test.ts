import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { streamChatAnswer } from "@/entities/chat/api/streamChatAnswer";
import type { ChatMessage } from "@/entities/chat/model/chatMessage";
import type { ChatStreamEvent } from "@/entities/chat/model/chatStreamEvent";
import { useChatConversation } from "@/features/sendChatMessage/model/useChatConversation";

const replace = vi.fn();
const push = vi.fn();
const refresh = vi.fn();
const router = { replace, push, refresh };

vi.mock("next/navigation", () => ({
	useRouter: () => router,
}));
vi.mock("@/entities/chat/api/streamChatAnswer", () => ({
	streamChatAnswer: vi.fn(),
}));

const answer: ChatMessage = {
	id: 2,
	role: "ASSISTANT",
	content: "답변",
	sources: [],
	buildings: [],
	createdAt: "2026-11-13T14:20:00+09:00",
};

// 이벤트를 하나씩 밀어 넣을 수 있는 스트림. end를 부르면 끝남
function createController() {
	const queue: ChatStreamEvent[] = [];
	let wake: (() => void) | null = null;
	let isEnded = false;

	async function* stream(): AsyncGenerator<ChatStreamEvent> {
		while (true) {
			if (queue.length > 0) {
				yield queue.shift() as ChatStreamEvent;
				continue;
			}

			if (isEnded) {
				return;
			}

			await new Promise<void>((resolve) => {
				wake = resolve;
			});
		}
	}

	return {
		stream,
		push(event: ChatStreamEvent) {
			queue.push(event);
			wake?.();
		},
		end() {
			isEnded = true;
			wake?.();
		},
	};
}

const baseOptions = {
	chatId: null,
	buildingId: null,
	initialMessages: [],
	isLimitReached: false,
	firstQuestion: null,
};

describe("useChatConversation", () => {
	beforeEach(() => {
		replace.mockReset();
		push.mockReset();
		refresh.mockReset();
		vi.mocked(streamChatAnswer).mockReset();
	});

	it("질문을 보내면 사용자 말풍선을 붙이고 waiting, 글자가 오면 streaming, 끝나면 idle로 바꾸고 답변을 더함", async () => {
		const controller = createController();
		vi.mocked(streamChatAnswer).mockReturnValue(controller.stream());
		const { result } = renderHook(() => useChatConversation(baseOptions));

		act(() => result.current.send("질문"));

		expect(result.current.phase).toBe("waiting");
		expect(result.current.messages.map((message) => message.content)).toEqual([
			"질문",
		]);

		await act(async () => {
			controller.push({ type: "delta", text: "답" });
		});
		await waitFor(() => expect(result.current.phase).toBe("streaming"));
		expect(result.current.draft).toBe("답");

		await act(async () => {
			controller.push({ type: "done", message: answer });
			controller.end();
		});
		await waitFor(() => expect(result.current.phase).toBe("idle"));
		expect(result.current.draft).toBe("");
		expect(result.current.messages.map((message) => message.content)).toEqual([
			"질문",
			"답변",
		]);
	});

	it("새 대화의 스트림이 끝나면 대화 주소로 바꿈", async () => {
		const controller = createController();
		vi.mocked(streamChatAnswer).mockReturnValue(controller.stream());
		const { result } = renderHook(() => useChatConversation(baseOptions));

		act(() => result.current.send("질문"));
		await act(async () => {
			controller.push({ type: "chat", chatId: 6, title: "질문" });
			controller.push({ type: "done", message: answer });
			controller.end();
		});

		await waitFor(() =>
			expect(replace).toHaveBeenCalledWith("/chat/6", { scroll: false }),
		);
	});

	it("있는 대화에 질문하면 주소를 바꾸지 않고 스트림이 끝난 뒤 화면을 새로 고침", async () => {
		const controller = createController();
		vi.mocked(streamChatAnswer).mockReturnValue(controller.stream());
		const { result } = renderHook(() =>
			useChatConversation({ ...baseOptions, chatId: 1 }),
		);

		act(() => result.current.send("질문"));
		await act(async () => {
			controller.push({ type: "done", message: answer });
			controller.end();
		});

		await waitFor(() => expect(result.current.phase).toBe("idle"));
		expect(replace).not.toHaveBeenCalled();
		expect(refresh).toHaveBeenCalledTimes(1);
	});

	it("새 대화의 스트림이 끝나도 화면을 새로 고치지 않음", async () => {
		const controller = createController();
		vi.mocked(streamChatAnswer).mockReturnValue(controller.stream());
		const { result } = renderHook(() => useChatConversation(baseOptions));

		act(() => result.current.send("질문"));
		await act(async () => {
			controller.push({ type: "chat", chatId: 6, title: "질문" });
			controller.push({ type: "done", message: answer });
			controller.end();
		});

		await waitFor(() => expect(replace).toHaveBeenCalled());
		expect(refresh).not.toHaveBeenCalled();
	});

	it("일일 한도 오류이면 방금 붙인 질문 말풍선을 지우고 limit으로 바꿈", async () => {
		const controller = createController();
		vi.mocked(streamChatAnswer).mockReturnValue(controller.stream());
		const { result } = renderHook(() => useChatConversation(baseOptions));

		act(() => result.current.send("질문"));
		await act(async () => {
			controller.push({ type: "error", code: "CHAT_DAILY_LIMIT" });
		});

		await waitFor(() => expect(result.current.phase).toBe("limit"));
		expect(result.current.messages).toEqual([]);
	});

	it("요청 제한 오류이면 받은 글자를 지우고 error로 바꾸며 질문 말풍선은 남김", async () => {
		const controller = createController();
		vi.mocked(streamChatAnswer).mockReturnValue(controller.stream());
		const { result } = renderHook(() => useChatConversation(baseOptions));

		act(() => result.current.send("질문"));
		await act(async () => {
			controller.push({ type: "delta", text: "답" });
			controller.push({ type: "error", code: "TOO_MANY_REQUESTS" });
		});

		await waitFor(() => expect(result.current.phase).toBe("error"));
		expect(result.current.errorCode).toBe("TOO_MANY_REQUESTS");
		expect(result.current.draft).toBe("");
		expect(result.current.messages).toHaveLength(1);
	});

	it("완료 이벤트 없이 스트림이 끝나면 서버 오류로 바꿈", async () => {
		const controller = createController();
		vi.mocked(streamChatAnswer).mockReturnValue(controller.stream());
		const { result } = renderHook(() => useChatConversation(baseOptions));

		act(() => result.current.send("질문"));
		await act(async () => {
			controller.push({ type: "delta", text: "답" });
			controller.end();
		});

		await waitFor(() => expect(result.current.phase).toBe("error"));
		expect(result.current.errorCode).toBe("SERVER_ERROR");
	});

	it("다시 시도하면 실패한 질문 말풍선을 지우고 같은 질문을 새 요청으로 보냄", async () => {
		const failed = createController();
		vi.mocked(streamChatAnswer).mockReturnValueOnce(failed.stream());
		const { result } = renderHook(() => useChatConversation(baseOptions));

		act(() => result.current.send("질문"));
		await act(async () => {
			failed.push({ type: "error", code: "SERVER_ERROR" });
		});
		await waitFor(() => expect(result.current.phase).toBe("error"));

		const retried = createController();
		vi.mocked(streamChatAnswer).mockReturnValueOnce(retried.stream());
		act(() => result.current.retry());

		expect(result.current.phase).toBe("waiting");
		expect(result.current.errorCode).toBeNull();
		expect(result.current.messages.map((message) => message.content)).toEqual([
			"질문",
		]);
		expect(streamChatAnswer).toHaveBeenCalledTimes(2);
		expect(vi.mocked(streamChatAnswer).mock.calls[1][0].content).toBe("질문");
	});

	it("전송 중에는 질문을 보내지 않음", () => {
		vi.mocked(streamChatAnswer).mockReturnValue(createController().stream());
		const { result } = renderHook(() => useChatConversation(baseOptions));

		act(() => result.current.send("질문"));
		act(() => result.current.send("다른 질문"));

		expect(streamChatAnswer).toHaveBeenCalledTimes(1);
	});

	it("한도를 모두 사용한 상태에서는 질문을 보내지 않음", () => {
		const { result } = renderHook(() =>
			useChatConversation({ ...baseOptions, isLimitReached: true }),
		);

		act(() => result.current.send("질문"));

		expect(result.current.phase).toBe("limit");
		expect(streamChatAnswer).not.toHaveBeenCalled();
	});

	it("첫 질문이 있으면 처음 그릴 때 바로 보냄", () => {
		vi.mocked(streamChatAnswer).mockReturnValue(createController().stream());
		const { result } = renderHook(() =>
			useChatConversation({ ...baseOptions, firstQuestion: "첫 질문" }),
		);

		expect(result.current.phase).toBe("waiting");
		expect(result.current.messages[0].content).toBe("첫 질문");
	});

	it("로그인이 풀리면 돌아올 경로를 담아 로그인으로 이동함", async () => {
		const controller = createController();
		vi.mocked(streamChatAnswer).mockReturnValue(controller.stream());
		const { result } = renderHook(() => useChatConversation(baseOptions));

		act(() => result.current.send("질문"));
		await act(async () => {
			controller.push({ type: "error", code: "UNAUTHORIZED" });
		});

		await waitFor(() => expect(push).toHaveBeenCalledWith("/login?next=%2F"));
	});
});
