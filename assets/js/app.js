$(document).on("click", "#newScrape", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
})