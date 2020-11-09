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


## Step 2: Indexing

Download Solr binaries from [here](https://lucene.apache.org/solr/downloads.html) and unzip it in the root of the repo.

Start the Solr server:

`cd ../solr-8.6.2`

`bin/solr start`

Answer to the prompts to configure your Solr instance, then create and index the crawled collection:

`bin/solr create -c movies`

`bin/post -c movies ../crawler/*_result.json`


## Step 3: Browsing

Go back to the root of the repo, start the webserver

`cd ..`

`yarn start`

and go to `localhost:3000` to use the search UI. It's that simple!


## Cleanup

Kill the UI webserver, then delete the Solr collection:

`cd solr-8.6.2/`

`bin/solr delete -c movies`

Stop Solr:

`bin/solr stop -all`
