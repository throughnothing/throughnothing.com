task :default => [:"site:deploy:dev"]

namespace :site do
	desc "deletes _site"
	task :delete do
		puts "deleting _site"
		system('rm -r _site')
		puts "deleting _site complete"
	end

	desc "minify all js files in _js/"
	task :minjs do
		puts "minify'ing js in _js/"
		system('(cd _js; for f in *.js; do cat $f | ../_scripts/jsmin.py >> ../js/$f ; done)')
		puts "minify'ing js in _js/ complete"
	end

	desc "build _site"
	namespace :build do
		desc "build and deploy dev"
		task :dev => [:delete,:minjs] do
			puts "building _site"
			system('ejekyll --server 9000 --auto')
		end

		desc "build pro"
		task :pro => [:delete,:minjs] do
			puts "building _site"
			puts "building production _site"
			system('ejekyll')
			puts "building _site complete"
		end

	end

	desc "rsync _site"
	task :rsync => :"build:pro" do
		system('rsync -arz _site/ throughnothing@throughnothing.com:/var/www/travel.throughnothing.com')
	end

	desc "deploy the application"
	namespace :deploy do
		desc "builds the development _site"
		task :dev => [:"build:dev"] do
			puts "dev site deployed"
		end

		desc "builds the production _site and deploys it"
		task :pro => [:rsync] do
			puts "pro site deployed"
		end
	end

	desc "generate static elements for the site"
	namespace :gen do
		desc "generate _js/photos_json.js file for flickr"
		task :photos_json do
			puts "generating photos_json.js"
			system('python _scripts/flickr_json_generator.py > _js/photos_json.js')
			puts "generating photos_json.js complete"
		end
	end
end
