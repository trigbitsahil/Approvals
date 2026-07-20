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

ps 33306;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 33306 > /dev/null;
done;

for child in $(list_child_processes 33307);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/sahilrattan/Desktop/approvals/App.Server/bin/Debug/net8.0/19d3c11366c740a4926e615f3e0e6e68.sh;
