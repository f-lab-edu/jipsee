# Jipsee ERD

## user

> 사용자 정보

```mermaid
erDiagram
    user {
        bigint id PK "사용자 ID, 자동 증가"
        varchar provider UK "로그인 수단: GOOGLE, KAKAO, NAVER"
        varchar provider_user_id UK "로그인 수단이 발급한 사용자 고유 ID"
        timestamp created_at "가입 시각"
    }
```

- UNIQUE(provider, provider_user_id): 로그인 수단별 별도 계정
- 탈퇴 시 행 삭제 (하드 삭제)

## building_parcel

> 필지

```mermaid
erDiagram
    building_parcel {
        bigint id PK "필지 ID, 자체 발급"
        varchar name "건물명 bldNm, 없으면 NULL"
        char sigungu_cd UK "시군구코드 5자리 (sigunguCd)"
        char bjdong_cd UK "법정동코드 뒤 5자리 (bjdongCd)"
        char plat_gb_cd UK "대지구분, 대지:0, 산:1, 블록:2 (platGbCd)"
        char bun UK "지번의 번, 4자리 0 채움, 없으면 0000"
        char ji UK "지번의 지, 4자리, 없으면 0000"
    }
```

- UNIQUE(sigungu_cd, bjdong_cd, plat_gb_cd, bun, ji): 필지 식별을 위한 유니크 제약조건
- 예: 서울 종로구 부암동 208-13 = `11110`, `18400`, `0`, `0208`, `0013`
