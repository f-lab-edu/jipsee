package kr.jipsee;

import java.util.TimeZone;
import kr.jipsee.batch.common.BatchJobRunner;
import kr.jipsee.global.TimeZones;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

/** 배치 앱 진입점. Job 하나를 실행하고 결과를 종료 코드로 프로세스 종료 */
@Slf4j
@SpringBootApplication
public class JipseeBatchApplication {
    /** 실행할 Job 이름이 없을 때의 종료 코드 */
    private static final int BAD_ARGS = 2;

    /** 컨텍스트를 시작하고 {@link #exitCode}의 값으로 프로세스를 종료 */
    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone(TimeZones.SEOUL));
        ConfigurableApplicationContext context = SpringApplication.run(JipseeBatchApplication.class, args);

        System.exit(exitCode(context));
    }

    /** 컨텍스트를 종료하고 종료 코드를 반환. Job 이름 프로퍼티가 없으면 2, 있으면 ExitCodeGenerator의 값 */
    static int exitCode(ConfigurableApplicationContext context) {
        if (!context.getEnvironment().containsProperty(BatchJobRunner.RUN_JOB_PROPERTY)) {
            log.error("실행할 Job 이름이 없음. {} 또는 환경 변수 JIPSEE_BATCH_RUN_JOB 필요", BatchJobRunner.RUN_JOB_PROPERTY);
            return SpringApplication.exit(context, () -> BAD_ARGS);
        }

        return SpringApplication.exit(context);
    }
}
