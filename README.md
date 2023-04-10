# lantern-config
A React based front end to configure the Lantern Power Monitor config file directly on a Raspberry Pi.
## Requirements
- Raspberry Pi with the Lantern Power Monitor image
- lantern-config-api NodeJS running on the Raspberry Pi
- [Modified](https://github.com/hdoedens/LanternPowerMonitor) Current Monitor Java project copied to the Pi

## Installation
Follow instructions to copy [SD card image](https://cf.lanternpowermonitor.com/hub_1.1.1.zip) to an SD card using [Balena Etcher](https://www.balena.io/etcher/) for example.
### Install and configure nginx
- Install nginx on the Pi `sudo apt-get update && sudo apt-get install nginx`
- Create a lantern-config directory in the Pi home folder with `mkdir /home/pi/lantern-config`
- Modify `/etc/nginx/sites-available/default` and change the following within the `server` tag:

```
root /home/pi/lantern-config

location / {
    try_files $uri $uri/ /index.html =404;
}
```

### Install lantern-config
- Copy the 'compressed' lantern-config React build to the Pi: (from your pc) `scp -r dist/* pi@<ip of the lanternmonitor pi>:/home/pi/lantern-config`

Now you should be able to navigate to your Pi's IP address and see something like an empty website. It is empty because the data for the site is [served](https://github.com/hdoedens/lantern-config-api) by a Node back-end.
