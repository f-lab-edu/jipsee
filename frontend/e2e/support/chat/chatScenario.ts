// chatMock.ts의 chatMockScenario와 같은 값을 TC_CHAT으로 알려 줘야 함. 기본값은 normal
export const CHAT_SCENARIO = process.env.TC_CHAT ?? "normal";
export const LOGGED_IN = process.env.TC_SESSION === "in";
