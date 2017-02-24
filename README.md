# emission-by-country
What if everyone in the world emitted CO2 like the average person of different countries?

## Setup
Install node, npm, and bower if they've not already been installed.

Then, clone the repo and run `npm install` and `bower install`.

###MySQL Info
If access denied on connect, try changing

`bind-address` in `/etc/mysql/mysql.conf.d/mysqld.cnf` to `0.0.0.0`

(allow from any IP). Then

`sudo /etc/init.d/mysql restart`

to restart mysql server.

`netstat -tln` outside mySQL terminal to check to see if port is open.

Check `/var/log/mysql` to double check mySQL logs to see that restart has indeed occured.