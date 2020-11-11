# IR-project
USI Information Retrieval final project #21 by Stefano Taillefert

## Step 1: Crawling
First install scrapy (requires python, good luck if you're on windows):

`pip install scrapy`

Then move into the crawler directory and run the desired spider(s):

`cd crawler`

`scrapy crawl -o imdb_result.json imdb`

(more to come)

This will save all the data in JSON format in the file specified with the `-o` parameter.


## Step 2: Indexing and browsing (the easy/prod way)

Use the included Docker image to create your collection and spin up the UI webserver:

`cd ..`

`docker-compose up -d`

Then feed it the data that you crawled (must be in the data directory):

`docker exec -it ir-project_solr post -c movies data/*`

That's it. Head over to `localhost:5000` and start browsing!


## Step 2x: Manually indexing and browsing (the hard/dev way)

Start the Solr server:

`cd ../solr-8.7.0`

`bin/solr start`

Answer to the prompts to configure your Solr instance, then create and index the crawled collection:

`bin/solr create -c movies`

`bin/post -c movies ../data/*_result.json`

Go back to the root of the repo, start the webserver

`cd ..`

`yarn start`

and go to `localhost:3000` to use the search UI. It's that simple!


## Cleanup

If you used Docker, simply shut down the containers with

`docker-compose down`

Otherwise kill the UI webserver, then delete the Solr collection:

`cd solr-8.7.0/`

`bin/solr delete -c movies`

Stop Solr:

`bin/solr stop -all`
