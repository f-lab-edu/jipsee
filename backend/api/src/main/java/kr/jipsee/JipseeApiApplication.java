package kr.jipsee;

import java.util.TimeZone;
import kr.jipsee.global.TimeZones;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JipseeApiApplication {
    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone(TimeZones.SEOUL));
        SpringApplication.run(JipseeApiApplication.class, args);
    }
}
