import type { PolicyDocument } from "@/pages/policy/model/policyDocument";

// 임시 초안. 본문 문서(2026-11-12-s6-policy-content.md) 1절을 그대로 옮김. 처리 위탁과 국외 이전의 수탁자별 표는 수탁자를 소제목으로 둔 줄 묶음으로 옮김
export const privacyDocument: PolicyDocument = {
	title: "개인정보처리방침",
	effectiveDate: "2026.11.12",
	clauses: [
		{
			title: "처리 목적",
			blocks: [
				{
					kind: "paragraph",
					text: "집씨는 「개인정보 보호법」 제30조에 따라 이용자의 개인정보를 안전하게 처리하고 관련한 고충을 신속하게 해결하기 위해 이 개인정보처리방침을 둡니다.",
				},
				{
					kind: "paragraph",
					text: "집씨는 다음 목적으로 개인정보를 처리합니다.",
				},
				{
					kind: "list",
					items: [
						"회원 식별: 로그인한 회원을 구분하고, 회원 본인의 대화 기록을 본인에게만 보여 줍니다.",
						"챗봇 제공: 회원이 입력한 질문에 답변하고 대화 기록을 보여 줍니다.",
						"요청 제한: 과도한 요청을 막고 챗봇의 일일 사용 한도를 적용합니다.",
						"부정 이용 방지: 자동화된 수집, 지시 조작 같은 부정 이용을 확인하고 이용을 제한합니다.",
					],
				},
				{
					kind: "paragraph",
					text: "처리한 개인정보는 위 목적 외에는 사용하지 않습니다. 목적이 바뀌면 법에 따라 필요한 조치를 합니다.",
				},
			],
		},
		{
			title: "처리 항목",
			blocks: [
				{
					kind: "paragraph",
					text: "집씨가 처리하는 개인정보의 항목은 다음과 같습니다.",
				},
				{
					kind: "rows",
					rows: [
						{
							label: "회원 가입과 로그인",
							value:
								"로그인 제공자(구글, 카카오, 네이버), 제공자가 발급한 사용자 고유 ID, 가입 시각",
						},
						{
							label: "챗봇 이용",
							value:
								"회원이 입력한 질문과 챗봇의 답변(대화 내용), 대화의 대상으로 고른 건물",
						},
						{
							label: "서비스 이용 중 자동으로 생성되는 정보",
							value:
								"접속 IP, 접속 기록(접속 시각, 요청 경로, 처리 결과), 로그인 세션 쿠키",
						},
						{ label: "이용 제한", value: "이용 제한 시각" },
					],
				},
				{
					kind: "paragraph",
					text: "집씨는 이름, 이메일 주소, 전화번호, 생년월일, 프로필 사진을 수집하지 않습니다. 로그인 제공자에는 사용자 고유 ID를 확인하는 데 필요한 최소 항목만 요청합니다. [임시 로그인 구현이 끝나면 제공자별 요청 항목과 대조]",
				},
				{
					kind: "paragraph",
					text: "이용자가 입력한 대화 내용은 챗봇 답변을 만들기 위해 외부 LLM 제공사로 전송됩니다. 전송 내용과 이전받는 자는 조항 4와 조항 5에 적었습니다.",
				},
				{ kind: "paragraph", text: "생성형 AI 서비스에 관한 안내입니다." },
				{
					kind: "list",
					items: [
						"챗봇에 입력한 글과 챗봇이 만든 답변은 대화 기록으로 저장됩니다.",
						"입력한 내용은 집씨와 LLM 제공사의 AI 모델 학습에 사용하지 않습니다. 집씨는 모델을 직접 학습하지 않으며, LLM 제공사(Anthropic, PBC)는 상업용 약관에서 고객 콘텐츠로 모델을 학습하지 않는다고 정하고 있습니다.",
						"주민등록번호, 계좌번호, 연락처 같은 민감한 정보나 고유식별정보를 입력하지 마세요.",
						"부적절한 답변은 조항 7의 7.4에 적은 방법으로 신고할 수 있습니다.",
					],
				},
			],
		},
		{
			title: "보유 기간, 파기",
			blocks: [
				{
					kind: "paragraph",
					text: "개인정보의 보유 기간은 다음과 같습니다.",
				},
				{
					kind: "rows",
					rows: [
						{ label: "계정 정보", value: "탈퇴할 때까지 보관합니다." },
						{
							label: "대화 기록",
							value: "회원이 삭제하거나 탈퇴할 때까지 보관합니다.",
						},
						{ label: "접속 기록", value: "[임시 보관 기간 미정]" },
						{
							label: "이용 제한 이력",
							value:
								"이용이 제한된 회원이 탈퇴하면 재가입으로 제한을 피하지 못하도록 로그인 제공자, 사용자 고유 ID, 제한 시각만 60일 동안 보관한 뒤 삭제합니다.",
						},
					],
				},
				{
					kind: "paragraph",
					text: "회원이 탈퇴하면 계정과 대화 기록을 즉시 삭제합니다. 백업에 남은 정보는 7일 뒤에 삭제합니다.",
				},
				{
					kind: "paragraph",
					text: "보유 기간이 끝났거나 처리 목적을 이룬 개인정보는 지체 없이 데이터베이스에서 삭제합니다.",
				},
			],
		},
		{
			title: "처리 위탁",
			blocks: [
				{
					kind: "paragraph",
					text: "제3자 제공: 집씨는 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 근거가 있는 경우는 예외로 합니다.",
				},
				{
					kind: "paragraph",
					text: "집씨는 서비스 운영을 위해 다음 업무를 위탁합니다.",
				},
				{
					kind: "rows",
					heading: "Oracle [임시 계약 법인명 확인 필요]",
					rows: [
						{
							label: "위탁 업무",
							value: "서버, 데이터베이스, 백업 저장소 운영",
						},
						{
							label: "위탁 항목",
							value: "계정, 대화 기록, 접속 기록, 백업",
						},
						{
							label: "보유 기간",
							value: "탈퇴 또는 삭제할 때까지(백업은 7일)",
						},
					],
				},
				{
					kind: "rows",
					heading: "Anthropic, PBC",
					rows: [
						{ label: "위탁 업무", value: "챗봇 답변 생성(LLM 처리)" },
						{ label: "위탁 항목", value: "대화 내용" },
						{
							label: "보유 기간",
							value:
								"제공사가 입력과 출력을 30일 안에 삭제함(위반 의심 건은 최대 2년)",
						},
					],
				},
				{
					kind: "rows",
					heading: "Cloudflare, Inc. [2단계 확정 전]",
					rows: [
						{ label: "위탁 업무", value: "CDN, 봇 차단" },
						{ label: "위탁 항목", value: "접속 IP, 요청 정보" },
						{ label: "보유 기간", value: "[임시 확정 전]" },
					],
				},
				{
					kind: "rows",
					heading: "Functional Software, Inc.(Sentry) [2단계 확정 전]",
					rows: [
						{ label: "위탁 업무", value: "오류 추적" },
						{ label: "위탁 항목", value: "오류 발생 정보" },
						{ label: "보유 기간", value: "[임시 확정 전]" },
					],
				},
				{
					kind: "paragraph",
					text: "위탁 업무가 바뀌거나 수탁자가 바뀌면 이 처리방침을 고쳐 알립니다.",
				},
			],
		},
		{
			title: "국외 이전",
			blocks: [
				{
					kind: "paragraph",
					text: "집씨는 서버 운영과 챗봇 답변 생성을 위해 개인정보를 국외로 이전해 처리하고 보관합니다. 법적 근거는 「개인정보 보호법」 제28조의8 제1항 제3호 가목이며, 같은 조 제2항에서 정한 사항을 이 처리방침에 공개합니다.",
				},
				{
					kind: "paragraph",
					text: "이전받는 자별 내용은 다음과 같습니다.",
				},
				{
					kind: "rows",
					heading: "Oracle",
					rows: [
						{
							label: "법적 근거",
							value:
								"「개인정보 보호법」 제28조의8 제1항 제3호 가목(처리위탁, 보관)",
						},
						{
							label: "이전받는 자",
							value: "Oracle [임시 계약 법인명과 연락처 확인 필요]",
						},
						{
							label: "이전 국가",
							value: "일본(Oracle Cloud Infrastructure 오사카 리전)",
						},
						{ label: "항목", value: "계정, 대화 기록, 접속 기록" },
						{ label: "시기, 방법", value: "서비스 이용 시 네트워크 전송" },
						{
							label: "목적, 기간",
							value: "서버 보관, 탈퇴 시까지(백업은 7일)",
						},
						{ label: "거부 방법", value: "탈퇴. 거부 시 로그인 불가" },
					],
				},
				{
					kind: "rows",
					heading: "Anthropic, PBC",
					rows: [
						{
							label: "법적 근거",
							value: "「개인정보 보호법」 제28조의8 제1항 제3호 가목(처리위탁)",
						},
						{
							label: "이전받는 자",
							value: "Anthropic, PBC [임시 연락처 확인 필요]",
						},
						{
							label: "이전 국가",
							value: "미국 [임시 실제 처리 국가 확인 필요]",
						},
						{ label: "항목", value: "챗봇에 입력한 질문과 대화 내용" },
						{
							label: "시기, 방법",
							value: "챗봇 질문을 보낼 때마다 네트워크 전송",
						},
						{
							label: "목적, 기간",
							value:
								"챗봇 답변 생성. 제공사는 입력과 출력을 받은 뒤 30일 안에 삭제하며, 이용 정책 위반이 의심되면 최대 2년 보관함",
						},
						{
							label: "거부 방법",
							value: "챗봇을 이용하지 않거나 탈퇴. 거부 시 챗봇 이용 불가",
						},
					],
				},
				{
					kind: "rows",
					heading: "Cloudflare, Inc. [2단계 확정 전]",
					rows: [
						{
							label: "법적 근거",
							value: "「개인정보 보호법」 제28조의8 제1항 제3호 가목(처리위탁)",
						},
						{
							label: "이전받는 자",
							value: "Cloudflare, Inc. [임시 연락처 확인 필요]",
						},
						{ label: "이전 국가", value: "[임시 확정 전]" },
						{ label: "항목", value: "접속 IP, 요청 정보" },
						{ label: "시기, 방법", value: "서비스 이용 시 네트워크 전송" },
						{
							label: "목적, 기간",
							value: "CDN, 봇 차단 [임시 기간 확정 전]",
						},
						{
							label: "거부 방법",
							value: "서비스를 이용하지 않거나 탈퇴. 거부 시 서비스 이용 불가",
						},
					],
				},
				{
					kind: "rows",
					heading: "Functional Software, Inc.(Sentry) [2단계 확정 전]",
					rows: [
						{
							label: "법적 근거",
							value: "「개인정보 보호법」 제28조의8 제1항 제3호 가목(처리위탁)",
						},
						{
							label: "이전받는 자",
							value:
								"Functional Software, Inc.(Sentry) [임시 연락처 확인 필요]",
						},
						{
							label: "이전 국가",
							value:
								"미국 또는 EU [임시 저장 지역을 조직 생성 때 고르며 아직 정하지 않음]",
						},
						{ label: "항목", value: "오류 발생 정보" },
						{
							label: "시기, 방법",
							value: "오류가 발생할 때 네트워크 전송",
						},
						{
							label: "목적, 기간",
							value: "오류 추적 [임시 기간 확정 전]",
						},
						{
							label: "거부 방법",
							value: "서비스를 이용하지 않거나 탈퇴. 거부 시 서비스 이용 불가",
						},
					],
				},
			],
		},
		{
			title: "쿠키",
			blocks: [
				{
					kind: "paragraph",
					text: "쿠키는 웹사이트가 이용자의 브라우저에 저장하는 작은 정보 파일입니다.",
				},
				{
					kind: "paragraph",
					text: "집씨는 로그인 상태를 유지하기 위해 로그인 세션 쿠키를 사용합니다.",
				},
				{
					kind: "paragraph",
					text: "이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있습니다. 쿠키를 거부하면 로그인할 수 없습니다.",
				},
			],
		},
		{
			title: "정보주체 권리",
			blocks: [
				{
					kind: "paragraph",
					text: "이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있고 동의를 철회할 수 있습니다.",
				},
				{
					kind: "paragraph",
					text: "회원 탈퇴는 내 정보 화면에서 직접 할 수 있습니다. 탈퇴하면 계정과 대화 기록이 삭제됩니다. 대화 기록은 대화 화면에서 개별로 삭제할 수도 있습니다.",
				},
				{
					kind: "paragraph",
					text: "그 밖의 요청은 조항 9의 이메일로 보내 주세요. 요청을 받으면 10일 안에 처리 결과를 알립니다.",
				},
				{
					kind: "paragraph",
					text: "챗봇의 부적절한 답변은 조항 9의 이메일로 신고하거나 이의를 제기할 수 있습니다. 신고를 받으면 확인한 뒤 결과를 알립니다. [임시 신고 화면 도입 여부 미정]",
				},
				{
					kind: "paragraph",
					text: "개인정보 침해로 인한 피해를 구제받으려면 다음 기관에 상담이나 신고를 할 수 있습니다.",
				},
				{
					kind: "rows",
					rows: [
						{
							label: "개인정보침해신고센터",
							value: "국번 없이 118, privacy.kisa.or.kr",
						},
						{
							label: "개인정보분쟁조정위원회",
							value: "1833-6972, www.kopico.go.kr",
						},
					],
				},
			],
		},
		{
			title: "안전성 확보 조치",
			blocks: [
				{
					kind: "paragraph",
					text: "집씨는 개인정보를 안전하게 처리하기 위해 다음 조치를 합니다.",
				},
				{
					kind: "list",
					items: [
						"통신 구간 암호화: 모든 접속에 HTTPS를 사용합니다.",
						"서버 접근 제한: 서버와 데이터베이스에 접근할 수 있는 사람과 경로를 제한합니다.",
						"비밀값 분리: 인증키와 비밀번호 같은 비밀값은 소스 코드와 분리해 보관합니다.",
					],
				},
				{ kind: "paragraph", text: "[임시 실제 운영 구성과 대조 필요]" },
			],
		},
		{
			title: "보호책임자",
			blocks: [
				{
					kind: "paragraph",
					text: "집씨는 개인정보 처리에 관한 업무를 총괄하고 관련 고충을 처리하기 위해 다음과 같이 개인정보 보호책임자를 지정합니다.",
				},
				{
					kind: "rows",
					rows: [
						{ label: "성명", value: "[임시] 운영자" },
						{ label: "이메일", value: "[임시] privacy@jipsee.kr" },
						{ label: "연락처", value: "[임시] 연락처" },
					],
				},
			],
		},
		{
			title: "변경",
			blocks: [
				{
					kind: "paragraph",
					text: "이 개인정보처리방침은 2026년 11월 12일부터 시행합니다. [임시 시행일]",
				},
				{
					kind: "paragraph",
					text: "내용을 바꾸면 변경 내용과 시행일을 이 화면에 공지합니다. 이용자의 권리에 중요한 영향을 주는 변경은 시행 전에 공지합니다.",
				},
				{
					kind: "paragraph",
					text: "시행일을 기재하고 이전 버전을 보관합니다.",
				},
			],
		},
	],
};
