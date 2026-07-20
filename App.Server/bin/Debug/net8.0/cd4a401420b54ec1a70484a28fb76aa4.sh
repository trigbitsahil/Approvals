function list_child_processes () {
    local ppid=$1;
    local current_children=$(pgrep -P $ppid);
    local local_child;
    if [ $? -eq 0 ];
    then
        for current_child in $current_children
        do
          local_child=$current_child;
          list_child_processes $local_child;
          echo $local_child;
        done;
    else
      return 0;
    fi;
}

ps 36057;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 36057 > /dev/null;
done;

for child in $(list_child_processes 36068);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/sahilrattan/Desktop/approvals/App.Server/bin/Debug/net8.0/cd4a401420b54ec1a70484a28fb76aa4.sh;
