import scrapy

SEARCH_QUERY = 'https://www.imdb.com/search/title/?release_date=2010-01-01,2020-12-31&adult=include'

class ImdbSpider(scrapy.Spider):
    name = 'imdb'
    allowed_domains = ['imdb.com']
    start_urls = [SEARCH_QUERY]

    def parse(self, response):
        movies = response.css('.lister-item')
        for movie in movies:
            year = movie.css('.lister-item-year::text').extract_first() or None
            genre = movie.css('.genre::text').extract_first() or None
            description = movie.css('.lister-item-content p:nth-child(4)::text').extract_first() or None

            if year is not None:
                parsedyear = year[1:5].strip()
                if parsedyear.isdigit():
                    year = parsedyear
                else:
                    year = None

            if genre is not None:
                genre = genre.strip().split(', ')

            if description is not None:
                description = description.strip()

            yield {
                'title': movie.css('.lister-item-header a::text').extract_first().strip(),
                'rating': movie.css('.ratings-imdb-rating strong::text').extract_first(),
                'year': year,
                'img_url': movie.css('.lister-item-image a img::attr(src)').extract_first(),
                'genre': genre,
                'description': description,
                'origin': 'imdb'
            }

        next_page = response.css('.next-page::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)
