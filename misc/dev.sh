while true
do
    python manage.py runserver 0.0.0.0:8080;
    for((i=1;i<=4;i++));
    do 
        echo -n "$i ";
        sleep 1;
    done
done
