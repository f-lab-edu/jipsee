package kr.jipsee.deal.dto;

import java.util.regex.Pattern;

/** house_name 값 정규화 */
public final class HouseNames {

    private static final Pattern LETTER = Pattern.compile("[가-힣A-Za-z]");

    private HouseNames() {}

    /** 글자가 없는 값은 자리표시로 판단하고 null 반환, 그 밖의 값은 그대로 반환 */
    public static String normalize(String houseName) {
        if (houseName == null || !LETTER.matcher(houseName).find()) {
            return null;
        }

        return houseName;
    }
}
