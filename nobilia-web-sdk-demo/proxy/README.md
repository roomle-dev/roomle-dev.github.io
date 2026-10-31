# The demo proxy

This demo sends its library, order-manager and AI kitchen requests through the demo proxy, the
Cloud Function `proxy_request` of the GCP project `rml-showcases` (region `europe-west3`):
<https://europe-west3-rml-showcases.cloudfunctions.net/proxy_request>
(see `baseUrl` in [`src/utils/default-api-options.ts`](../src/utils/default-api-options.ts)).

Its code and its deployment scripts are in the repository
[roomle-dev/roomle-hi-example](https://github.com/roomle-dev/roomle-hi-example), in the folder
[`minifabric-example/proxy-server`](https://github.com/roomle-dev/roomle-hi-example/tree/master/minifabric-example/proxy-server).
