import scrapy

SEARCH_QUERY = 'https://www.allmovie.com/genres'

class AllmovieSpider(scrapy.Spider):
    name = 'allmovie'
    allowed_domains = ['allmovie.com']
    start_urls = [SEARCH_QUERY]

    def parse(self, response):
        genres = response.css('.genre')
        for genre in genres:
            next_page = genre.css('a::attr(href)').get()
            if next_page is not None:
                yield response.follow(next_page, callback=self.parse_genre_page)

    def parse_genre_page(self, response):
        movies = response.css('.movie')
        for movie in movies:
            genres = response.css('.genre-name::text').extract_first().split("/")
            parsed_genres = []
            for genre in genres:
                parsed_genres.append(genre.strip())

            yield {
                'title': movie.css('.title a::text').extract_first().strip(),
                'rating': movie.css('.allmovie-rating::text').extract_first().strip(),
                'year': movie.css('.movie-year::text').extract_first().strip(),
                'img_url': movie.css('.cropped-image img::attr(src)').extract_first(),
                'genre': parsed_genres,
                'description': None,
                'link': 'https://www.allmovie.com' + movie.css('.title a::attr(href)').extract_first()
            }

        next_page = response.css('.next a::attr(href)').get()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse_genre_page)
