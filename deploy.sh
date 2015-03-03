#!/usr/bin/bash
ssh eternal@www.eternal0.com "rm -rf /cygdrive/c/inetpub/wwwroot/chaos"
ssh eternal@www.eternal0.com "mkdir /cygdrive/c/inetpub/wwwroot/chaos"
scp -r app/dist/* eternal@www.eternal0.com:/cygdrive/c/inetpub/wwwroot/chaos
