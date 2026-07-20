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

ps 74312;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 74312 > /dev/null;
done;

for child in $(list_child_processes 74398);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/sahilrattan/Desktop/approvals/App.Server/bin/Debug/net8.0/60de7f0b5f3f447aa3b7d1fecefda1ef.sh;
