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

The service will also announce itself as `xz-as-a-service.local` so you can do

```sh
curl --upload-file my.tar http://xz-as-a-service.local:9927 > my.tar.xz
```

If you want to change the name there is a `--name` flag

```sh
xz-as-a-service --name another-name --port 9927
```

## License

MIT
