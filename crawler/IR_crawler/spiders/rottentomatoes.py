import scrapy

SEARCH_QUERY = 'https://www.rottentomatoes.com/browse/dvd-streaming-all'

class RottentomatoesSpider(scrapy.Spider):
    name = 'rottentomatoes'
    allowed_domains = ['rottentomatoes.com']
    start_urls = [SEARCH_QUERY]

    def parse(self, response):
        movies = response.css('.mb-movie')
        for movie in movies:
            # TODO crawl detail pages
            year = movie.css('.lister-item-year::text').extract_first() or None
            genre = movie.css('.genre::text').extract_first() or None
            description = movie.css('.lister-item-content p:nth-child(4)::text').extract_first() or None

            if year is not None:
                parsedyear = year[1:4].strip()
                if parsedyear.isdigit():
                    year = parsedyear
                else:
                    year = None

            if genre is not None:
                genre = genre.strip().split(', ')

            if description is not None:
                description = description.strip()

            yield {
                'title': movie.css('.movieTitle::text').extract_first(),
                'rating': movie.css('.tMeterIcon::text').extract_first(),
                'year': year,
                'img_url': movie.css('.poster::attr(src)').extract_first(),
                'genre': genre,
                'description': description,
                'origin': 'rottentomatoes'
            }

        next_page = response.css('.next-page::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)
