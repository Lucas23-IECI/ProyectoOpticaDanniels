FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y curl git sudo nano && \
    apt clean && rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash devuser && echo "devuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

WORKDIR /home/devuser
COPY setup.sh /home/devuser/setup.sh
RUN chmod +x /home/devuser/setup.sh && chown devuser:devuser /home/devuser/setup.sh

USER devuser

CMD ["bash"]
