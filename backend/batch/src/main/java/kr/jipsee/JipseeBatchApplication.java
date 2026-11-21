package kr.jipsee;

import java.util.TimeZone;
import kr.jipsee.global.TimeZones;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** 배치 앱 진입점. Job 하나를 실행하고 결과를 종료 코드로 프로세스 종료 */
@SpringBootApplication
public class JipseeBatchApplication {
    /** 컨텍스트를 시작하고 ExitCodeGenerator의 값으로 프로세스를 종료 */
    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone(TimeZones.SEOUL));
        System.exit(SpringApplication.exit(SpringApplication.run(JipseeBatchApplication.class, args)));
    }
}
