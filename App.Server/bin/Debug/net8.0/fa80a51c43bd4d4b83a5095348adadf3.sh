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

ps 21145;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 21145 > /dev/null;
done;

for child in $(list_child_processes 21152);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/sahilrattan/Desktop/approvals/App.Server/bin/Debug/net8.0/fa80a51c43bd4d4b83a5095348adadf3.sh;
