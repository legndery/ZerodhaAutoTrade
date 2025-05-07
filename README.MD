### Create Certificate in `cert` folder
```
openssl req \
-newkey rsa:2048 \
-x509 \
-nodes \
-keyout localhost.key \
-new \
-out localhost.crt \
-subj /CN=localhost \
-reqexts SAN \
-extensions SAN \
-config <(cat /etc/ssl/openssl.cnf \
    <(printf '[SAN]\nsubjectAltName=DNS:localhost,IP:127.0.0.1')) \
-sha256 \
-days 3650
```

In MAC: `sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" localhost.crt`

