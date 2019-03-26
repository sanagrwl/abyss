FROM openjdk:8-jre-alpine

RUN addgroup -g 1001 abyss && \
    adduser -D -u 1001 -h /abyss -G abyss abyss
USER 1001
WORKDIR /abyss

RUN mkdir sounds
VOLUME [ "/abyss/sounds" ]

COPY target/abyss-1.0.0-standalone.jar abyss.jar
COPY sounds sounds


CMD ["java", "-jar", "./abyss.jar", "-DsoundsDir=sounds"]