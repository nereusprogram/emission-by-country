# emission-by-country

What if everyone in the world emitted CO2 like the average person of different countries? This web app compares per capita emissions data for different countries.

## Setup

Install node and npm if they've not already been installed.
Then `npm install bower.`
Then run `npm install` and `bower install`.
Then `npm start` runs the app.

### Notes for Nereus

This web app, along with all the web apps I developed for the United Nations Ocean Conference 2017 runs on an AWS instance with IP address 35.167.85.111. Each app runs on a different port. This one runs at http://35.167.85.111:3003.

The mySQL server that this web app pulls data from also runs at 35.167.85.111. It contains two schemas: international-treaties and emission-by-country. Contact me (username chantellechan1 on GitHub) for root account access to the mySQL server. I have a google drive document with relevant info for you. Access account credentials for each app are available in `./server.js`. 

When moving this app to a different instance, the port that it runs on can be changed in `./server.js`. Note that you will need to also update the emissions by country link in the view of the landing page app, available at https://github.com/chantellechan1/nereus-data-vis-landing-page. Either fork the repo or contact me to change it.

### Troubleshooting

#### mySQL
If access denied on connect, try changing

`bind-address` in `/etc/mysql/mysql.conf.d/mysqld.cnf` to `0.0.0.0`

(allow from any IP). Then

`sudo /etc/init.d/mysql restart`

to restart mysql server.

`netstat -tln` outside mySQL terminal to check to see if port is open.

Check `/var/log/mysql` to double check mySQL logs to see that restart has indeed occured.

#### Difficulty running on port 80
<pre><code>
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep `readlink -f \`which node\``
</code></pre>
