# xz-as-a-service

xz compression as a service

```
npm install -g xz-as-a-service
```

## Usage

First spin up the service

```sh
xz-as-a-service --port 9927
```

Then send a file to it you want to compress

```sh
curl --upload-file my.tar http://localhost:9927/ > my.tar.xz
```

## License

MIT
