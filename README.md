## Design, Considerations & Assumptions
It's assumed that the NFT data from LooksRare is populated manually, upon calling an endpoint as a trigger (`POST /nft-data/:collectionAddress`).
Also, I could not find any `trait`-related data in the docs,
so I've omitted specific business logic regarding this
requirement.

Multiple calls to the endpoint to populate the orders data
will not update or rewrite the existing records. The duplicate
records are simply skipped. This, of course, can be changed
based on requirements and needs.

Also, regarding getting the current floor price of the
collections returned in the GET orders endpoint:
whole functionality can be optimized by storing the floor price
when populating the collections in the DB. But that would make
sense in a different scope - when we have a watcher that
constantly updates the DB with collection and orders data.
For the current scope the current implementation would do -
namely, querying LooksRare's API for collections stats
for each collection that is being returned by the GET orders
endpoint.

The JSON file with entries, collections and followers data
is being read and stored in Redis, again, upon manual trigger
by an endpoint (`POST /cache`). The data will be stored in
two Redis-native sorted sets with scores per unique
collection/entry
and which are being incremented and keep track of the amount
of followers per collection/entry. This allows for very fast
and easy retrieval of certain sorted subset of the data, based
on the scores.

### Endpoints
`POST /nft-data/:collectionAddress` - populate the NFT orders data from LooksRare into the local DB

`GET /orders` - get orders. The following query params are possible:
* `type` (mandatory) = `LIST` or `OFFER`
* `minPrice` = integer
* `maxPrice` = integer
* `offset`   = integer

`POST /cache` - populate the JSON file data into Redis

`GET /cache` - get sorted sets of the 10 most followed entries and collections

## Prerequisites to run the app

1. Create a file named `.env` in the root of the project dir
2. Copy-paste the contents of the `.env.example` file into the `.env` file
3. Replace any values you like in the `.env` file.

### Quick start

#### Install

```bash
$ npm install
```

#### DB Docker containers

```bash
$ docker-compose up -d db
```
```bash
$ docker-compose up -d redis
```

#### Running the app

```bash
$ npm start
```
This will start the app locally in watch mode (changes to the code
will automatically trigger recompilation and restart of the app).
