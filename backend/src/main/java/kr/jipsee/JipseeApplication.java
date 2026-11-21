package kr.jipsee;

import java.util.TimeZone;
import kr.jipsee.batch.common.BatchJobRunner;
import kr.jipsee.global.common.TimeZones;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class JipseeApplication {
    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone(TimeZones.SEOUL));
        ConfigurableApplicationContext context = SpringApplication.run(JipseeApplication.class, args);

        if (context.getEnvironment().containsProperty(BatchJobRunner.RUN_JOB_PROPERTY)) {
            System.exit(SpringApplication.exit(context));
        }
    }
}
