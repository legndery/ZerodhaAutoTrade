## Setup
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
[Linux] For chrome UI support Need this: `basicConstraints=CA:TRUE,pathlen:0`
```
openssl req -newkey rsa:2048 -x509 -nodes -keyout localhost.key -new -out localhost.crt -subj /CN=localhost -reqexts SAN -extensions SAN -config <(cat /etc/ssl/openssl.cnf     <(printf '[SAN]\nbasicConstraints=CA:TRUE,pathlen:0\nsubjectAltName=DNS:localhost,IP:127.0.0.1')) -sha256 -days 3650
```

### To add it trusted root:
#### In MAC: 
```
sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" localhost.crt
```

#### For Linux:
```
sudo apt install -y ca-certificates
sudo cp localhost.crt /usr/local/share/ca-certificates
sudo update-ca-certificates
```
Then for it to be used in chromium,
```
chrome://settings/certificates -> Authorities -> Import the CRT file
```