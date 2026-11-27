package kr.jipsee.deal.dto;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 건물 키
 * - 시군구 코드, 법정동명, 지번 조합
 */
public record BuildingKey(String sigunguCode, String legalDongName, String lotNumber) {
    private static final Pattern ID_PATTERN = Pattern.compile("([0-9]{5})-([^-]+)-(.+)");

    /** 하이픈으로 연결한 건물 id */
    public String id() {
        return sigunguCode + "-" + legalDongName + "-" + lotNumber;
    }

    /** id 문자열을 키로 해석. 형식이 맞지 않으면 empty 반환 */
    public static Optional<BuildingKey> parse(String id) {
        if (id == null) {
            return Optional.empty();
        }

        Matcher matcher = ID_PATTERN.matcher(id);

        if (!matcher.matches()) {
            return Optional.empty();
        }

        return Optional.of(new BuildingKey(matcher.group(1), matcher.group(2), matcher.group(3)));
    }
}
