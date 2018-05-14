# Set working directory
setwd("C:/Users/Jordi/Desktop/InfoVis/datasets")

# Read data
data <- read.csv("dataset.csv", header=TRUE, stringsAsFactors=FALSE, sep=",")

###################### TOTAL STUDENTS PER COUNTRY

countries_total <- c()

for(row in 1:nrow(data)) {
	country <- data[row, "land"]
	countries_total <- c(country, countries_total)
}

country_count <- table(countries_total)
write.table(as.data.frame(country_count),file="mylist.csv", quote=F, sep=",", row.names=F, col.names=c("country", "amount"))


###################### TOTAL STUDENTS PER COUNTRY PER YEAR

years <- c("2013", "2014", "2015", "2016", "2017")

for(curr_year in years) {
	countries_per_year <- c()

	for(row in 1:nrow(data)) {
		year <- data[row, 1]
		if(year == curr_year) {
			country <- data[row, "land"]
			countries_per_year <- c(country, countries_per_year)
		}	
	}

	country_count <- table(countries_per_year)
	filename <- paste(curr_year, ".csv", sep="")
	write.table(as.data.frame(country_count),file=filename, quote=F, sep=",", row.names=F, col.names=c("country", "amount"))
}