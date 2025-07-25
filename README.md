Para las pruebas:

sudo apt update && sudo apt upgrade -y && sudo apt install -y git curl

curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && sudo usermod -aG docker $USER

sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose

git clone -b docker-testing-servidor https://github.com/Lucas23-IECI/ProyectoOpticaDanniels.git && cd ProyectoOpticaDanniels

echo "127.0.0.1 OpticaDanniels.com" | sudo tee -a /etc/hosts

newgrp docker

docker-compose up --build -d

docker-compose ps

firefox http://OpticaDanniels.com
