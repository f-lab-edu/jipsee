// 목업 대화 목록의 시각은 지금 날짜를 기준으로 만들어짐: 오늘 14:20, 어제 12:00, 올해 10월 21일, 18일, 15일(각 10:00)
// 기대 표기는 설계 문서(2026-11-13-s3-chat-design.md)의 규칙으로 지금 날짜에서 계산함: 오늘이면 오늘 HH:mm, 어제이면 어제, 같은 해이면 M.D, 다른 해이면 yyyy.M.D. 날짜는 한국 시간 기준임
type Day = { year: number; month: number; day: number };

const DAY_MS = 24 * 60 * 60 * 1000;

function toKstDay(date: Date): Day {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Seoul",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	}).formatToParts(date);
	const read = (type: string) =>
		Number(parts.find((part) => part.type === type)?.value);
	return { year: read("year"), month: read("month"), day: read("day") };
}

function isSameDay(a: Day, b: Day) {
	return a.year === b.year && a.month === b.month && a.day === b.day;
}

/** 목업 대화 다섯 개(최근 순)의 목록 시각 표기 */
export function expectedHistoryTimes(now = new Date()) {
	const today = toKstDay(now);
	const yesterday = toKstDay(new Date(now.getTime() - DAY_MS));
	const label = (target: Day, clock: string) => {
		if (isSameDay(target, today)) return `오늘 ${clock}`;
		if (isSameDay(target, yesterday)) return "어제";
		if (target.year === today.year) return `${target.month}.${target.day}`;
		return `${target.year}.${target.month}.${target.day}`;
	};
	const october = (day: number) => ({ year: today.year, month: 10, day });
	return [
		label(today, "14:20"),
		label(yesterday, "12:00"),
		label(october(21), "10:00"),
		label(october(18), "10:00"),
		label(october(15), "10:00"),
	];
}
