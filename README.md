# international-treaties
A simple MEAN SPA for serving international treaty information from a mySQL database.

## Setup
Install node and npm if they've not already been installed.
Then `npm install bower.`
Then, clone the repo and run `npm install` and `bower install`.

###MySQL Troubleshooting
If access denied on connect, try changing

`bind-address` in `/etc/mysql/mysql.conf.d/mysqld.cnf` to `0.0.0.0`

(allow from any IP). Then

`sudo /etc/init.d/mysql restart`

to restart mysql server.

`netstat -tln` outside mySQL terminal to check to see if port is open.

Check `/var/log/mysql` to double check mySQL logs to see that restart has indeed occured.
