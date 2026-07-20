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

ps 95183;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 95183 > /dev/null;
done;

for child in $(list_child_processes 95189);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/sahilrattan/Desktop/approvals/App.Server/bin/Debug/net8.0/a8dbf48be8474ab2a25ffc849a2b9b66.sh;
