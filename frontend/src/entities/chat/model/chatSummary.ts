export type ChatSummary = {
	id: number;
	title: string;
	// ISO 8601 한국 시간(KST)이며 오프셋이 없을 수 있음. 오프셋이 없으면 한국 시간으로 해석
	lastMessageAt: string;
};
