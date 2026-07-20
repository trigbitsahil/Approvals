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

ps 54001;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 54001 > /dev/null;
done;

for child in $(list_child_processes 54011);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/sahilrattan/Desktop/approvals/App.Server/bin/Debug/net8.0/e22ddca19cd7456f89d054fdc3a6b5d8.sh;
