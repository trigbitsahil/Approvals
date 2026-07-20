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

ps 11264;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 11264 > /dev/null;
done;

for child in $(list_child_processes 11279);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/sahilrattan/Desktop/approvals/App.Server/bin/Debug/net8.0/8cba0e35f9da49a9b36e9a428e1afc98.sh;
