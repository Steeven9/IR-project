# IR-project
![](https://img.shields.io/github/license/steeven9/IR-project)
![](https://img.shields.io/docker/cloud/automated/steeven9/ir-project)
![](https://img.shields.io/docker/cloud/build/steeven9/ir-project)
![](https://img.shields.io/tokei/lines/github/steeven9/IR-project)

Information Retrieval final project at USI, Lugano

## Step 1: Crawling (skip if you want to use the included data)
First install scrapy (requires Python, good luck if you're on Windows):

```console
$ pip install scrapy
```

Then move into the crawler directory and run the desired spider(s):

```console
$ cd crawler
```

```console
crawler$ scrapy crawl -o ../data/imdb_result.json imdb
```

```console
crawler$ scrapy crawl -o ../data/rottentomatoes_result.json rottentomatoes
```

```console
crawler$ scrapy crawl -o ../data/allmovie_result.json allmovie
```

This will save all the data in JSON format in the file specified with the `-o` parameter.


## Step 2: Indexing and browsing (the easy/prod way)

Use the included Docker image to create your collection and spin up the UI webserver:

```console
$ docker-compose up -d
```

Then feed it the data that you crawled (must be in the `data` directory and in 
a [supported format](https://lucene.apache.org/solr/guide/8_7/post-tool.html)):

```console
$ docker exec ir-project_solr post -c movies data/*
```

That's it. Head over to `localhost:3000` and start browsing!


## Step 2x: Manually indexing and browsing (the hard/dev way)

Start the Solr server (requires Java):

```console
$ solr-8.7.0/bin/solr start
```

Then create and index the crawled collection:

```console
$ solr-8.7.0/bin/solr create -c movies -d movies
```

```console
$ solr-8.7.0/bin/post -c movies ../data/*
```

Then start the webserver:

```console
$ yarn start
```

and go to `localhost:3000` to use the search UI. It's that simple!


## Cleanup

If you used Docker, simply shut down the containers with

```console
$ docker-compose down
```

Otherwise kill the UI webserver, then delete the Solr collection:

```console
$ solr-8.7.0/bin/solr delete -c movies
```

Stop Solr:

```console
$ solr-8.7.0/bin/solr stop -all
```
