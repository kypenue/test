#!/bin/bash

export PRE_LABEL=$(docker container ps --format '{{.Names}}'|awk -F '-' '{print $2}')
export PRE_CNAME="front-$PRE_LABEL"
export PRE_COMMIT="$PRE_LABEL"
export PRE_IMAGE_TAG="front:$PRE_LABEL"
export CURRENT_LABEL="$1"
export CURRENT_LABEL="$CURRENT_LABEL"
export CUR_IMAGE_TAG="front:$CURRENT_LABEL"
export CUR_CNAME="front-$CURRENT_LABEL"

if [ $PRE_LABEL = $CURRENT_LABEL ] ; then
    echo "Текущий коммит уже установлен, сборка и деплой не требуется"
    exit
fi

if (docker build . -t front:$CURRENT_LABEL) ; then
    echo "Build succesfull"
else
    echo "Build failed"
    exit
fi

port3000=$(ss -tulpn|grep 3000)
if [[ -z $port3000 ]] ; then
    echo "port 3000 available"
    portAva=true
else
    echo "port 3000 buisy!"
    portAva=false
fi

RUNED_CONTAINERS="$(docker ps -qa)"

if [ $portAva = true ] ; then
    echo "разворачиваем контейнер"
    docker run -d --name $CUR_CNAME -p 3000:3000 front:"$CURRENT_LABEL" && echo $CURRENT_LABEL > /opt/build/CURRENT_LABEL
else
    if (docker container stop $RUNED_CONTAINERS && docker container rm $RUNED_CONTAINERS) ; then
        echo "Порт 3000 занят предыдущий контейнер остановлен"
        if (docker run -d --name $CUR_CNAME -p 3000:3000 front:"$CURRENT_LABEL") ; then
            echo "успешно запущен"
            sleep 3
            docker image remove --force $PRE_IMAGE_TAG
            echo $CURRENT_LABEL > /opt/build/CURRENT_LABEL
        else
            echo "запущен не успешно, запускаем прошлую версию"
            docker run -d -p 3000:3000 --name "$PRE_CNAME" front:"$PRE_COMMIT"
            export CURRENT_LABEL=$PRE_COMMIT
            docker image remove --force $CUR_IMAGE_TAG
            echo $PRE_COMMIT > /opt/build/CURRENT_LABEL
            exit
        fi
    fi
fi

docker container prune -f && docker image prune -f
rm -rf $(find /opt/build -maxdepth 1 -type d -not -path /opt/build/$CURRENT_LABEL |grep -vx '/opt/build')

echo "Очистка docker"
docker system prune --all --force