// 앱의 목업 시나리오는 TC_CHAT으로 정하고 e2e/support/mockStorageState.ts가 쿠키로 넣음. 기본값은 normal
export const CHAT_SCENARIO = process.env.TC_CHAT ?? "normal";
export const LOGGED_IN = process.env.TC_SESSION === "in";
