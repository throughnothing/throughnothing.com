task :default => [:"site:deploy:dev"]

namespace :site do
	desc "deletes _site"
	task :delete do
		puts "deleting _site"
		system('rm -r _site')
		puts "deleting _site complete"
	end

	desc "build _site"
	namespace :build do
		desc "build and deploy dev"
		task :dev => :delete do
			puts "building _site"
			system('jekyll --server 9000 --auto')
		end

		desc "build pro"
		task :pro => :delete do
			puts "building production _site"
			system('jekyll')
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
		desc "generate js/photos_json.js file for flickr"
		task :photos_json do
			puts "generating photos_json.js"
			system('python _scripts/flickr_json_generator.py > js/photos_json.js')
			puts "generating photos_json.js complete"
		end
	end
end
