FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
COPY . .
RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:25-jre AS base
WORKDIR /app
USER ubuntu
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]

FROM base AS batch
COPY --from=build /app/batch/build/libs/batch-0.0.1.jar app.jar

# 마지막 단계가 기본 타깃이라 --target 없이 빌드하면 api 이미지가 나옴
FROM base AS api
COPY --from=build /app/api/build/libs/api-0.0.1.jar app.jar
