package kr.jipsee.matching.service;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import kr.jipsee.building.dto.ParcelKey;
import kr.jipsee.region.dto.LegalDongKey;

/** 거래 지번을 필지 키로 바꿈 */
public final class LotNumbers {
    private static final Pattern LOT_NUMBER = Pattern.compile("(산)?(\\d{1,4})(?:-(\\d{1,4}))?");

    private LotNumbers() {}

    /** N, N-M, 산N, 산N-M만 필지 키로 바꾸고 그 밖의 값은 빈 값 반환 */
    public static Optional<ParcelKey> toParcelKey(LegalDongKey legalDong, String lotNumber) {
        if (lotNumber == null) {
            return Optional.empty();
        }

        Matcher matcher = LOT_NUMBER.matcher(lotNumber);

        if (!matcher.matches()) {
            return Optional.empty();
        }

        String landType = matcher.group(1) == null ? "0" : "1";
        String main = pad(matcher.group(2));
        String sub = matcher.group(3) == null ? "0000" : pad(matcher.group(3));

        return Optional.of(new ParcelKey(legalDong.sigunguCode(), legalDong.legalDongCode(), landType, main, sub));
    }

    /** 앞을 0으로 채워 4자리로 만듦 */
    private static String pad(String number) {
        return "0".repeat(4 - number.length()) + number;
    }
}
