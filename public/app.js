function scrape() {
    $.ajax({
        url: "/api/scrape",
        method: "POST"
    }).then(function (response) {
        alert("OK. " + response.count + " new articles saved to database");
        location.reload();
    });
}


function deleteComment(articleId, commentId) {
    $.ajax({
        url: '/articles/' + articleId + '/comments/' + commentId,
        method: 'DELETE'
    }).then(function (response) {
        location.reload();
    });
}