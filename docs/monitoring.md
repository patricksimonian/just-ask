## Application Monitoring


Each component of the application can be individually monitored. There are already some preset defaults for logging for each component. 


## API Monitoring

### Logging
The API outputs all logs to `stdout` and `stderr`. Logs are configurable. You can adjust log level by setting the environment variable `LOG_LEVEL`. By default there is no timestamping of logs. This can be added by setting `LOG_TIME=abs` or `LOG_TIME=rel`.

### Health

There is a singular endpoint that is publicly accessible at `GET /server-health`. You can use this to check if the server is up and running. This check __does not verify__ if the database is connected to the server.



### Web Monitoring

### Logging

The web image is run with [Caddy Server](https://caddyserver.com/). The default caddy config is as follows

```
# Where caddy should listen
:2015
# Turn on the Web/file server
file_server

templates {
  mime application/javascript
  between <% %>
}
# The site root
root * /opt/app-root/www
# Because we should
encode zstd gzip


try_files {path} {path}/ index.html
header /service-worker.js {
# all static assets SHOULD be cached
  Content-Type "text/javascript"
}
  # On OCP we should log to stdout so Prometheus can
# slurp up the logs for human consumption.
log {
  errors stdout
  output stdout 
  format single_field common_log
  level info
}

```

Caddy will automatically surface info level logs. If you require more tuned caddy logging. You can mount your own caddy file over the original one at the path `/opt/app-root/etc/`.

### Health Check

To test if caddy is operational just check `GET /` for a healthy response